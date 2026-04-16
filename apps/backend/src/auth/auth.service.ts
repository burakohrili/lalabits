import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash, randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { User, UserAccountStatus } from './entities/user.entity';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { ConsentRecord, ConsentMethod } from '../legal/entities/consent-record.entity';
import { LegalDocumentVersion, LegalDocumentType } from '../legal/entities/legal-document-version.entity';
import { CreatorProfile, CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterFanDto } from './dto/register-fan.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { JwtPayload, JwtRefreshPayload } from './interfaces/jwt-payload.interface';

const REFRESH_KEY_PREFIX = 'refresh';

@Injectable()
export class AuthService {
  private readonly accessTtl: number;
  private readonly refreshTtl: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
    @InjectRepository(ConsentRecord)
    private readonly consentRecordRepository: Repository<ConsentRecord>,
    @InjectRepository(LegalDocumentVersion)
    private readonly legalDocumentVersionRepository: Repository<LegalDocumentVersion>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {
    this.accessTtl = parseInt(
      this.config.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL'),
      10,
    );
    this.refreshTtl = parseInt(
      this.config.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL'),
      10,
    );
  }

  async registerFan(
    dto: RegisterFanDto,
    ipAddress: string | null = null,
  ): Promise<{ id: string; email: string; display_name: string }> {
    // Check for existing email (including soft-deleted accounts)
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException('EMAIL_EXISTS');
    }

    const password_hash = await bcrypt.hash(dto.password, 12);

    // Generate raw token now so we have it after the transaction
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const now = new Date();

    let savedUser: User;

    try {
      savedUser = await this.userRepository.manager.transaction(async (manager) => {
        // Fetch current legal document versions within the transaction
        const [tosVersion, ppVersion] = await Promise.all([
          manager.findOne(LegalDocumentVersion, {
            where: { document_type: LegalDocumentType.TermsOfService, is_current: true },
          }),
          manager.findOne(LegalDocumentVersion, {
            where: { document_type: LegalDocumentType.PrivacyPolicy, is_current: true },
          }),
        ]);

        if (!tosVersion || !ppVersion) {
          throw new InternalServerErrorException('LEGAL_VERSIONS_MISSING');
        }

        const user = await manager.save(
          manager.create(User, {
            email: dto.email,
            password_hash,
            display_name: dto.display_name,
            has_fan_role: true,
            is_admin: false,
            account_status: UserAccountStatus.Active,
          }),
        );

        await manager.save(ConsentRecord, [
          manager.create(ConsentRecord, {
            user_id: user.id,
            document_type: LegalDocumentType.TermsOfService,
            legal_document_version_id: tosVersion.id,
            consented_at: now,
            consent_method: ConsentMethod.FanSignupEmail,
            ip_address: ipAddress,
          }),
          manager.create(ConsentRecord, {
            user_id: user.id,
            document_type: LegalDocumentType.PrivacyPolicy,
            legal_document_version_id: ppVersion.id,
            consented_at: now,
            consent_method: ConsentMethod.FanSignupEmail,
            ip_address: ipAddress,
          }),
        ]);

        await manager.save(
          manager.create(EmailVerificationToken, {
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: expiresAt,
            used_at: null,
          }),
        );

        return user;
      });
    } catch (err: unknown) {
      // Catch race-condition unique violation after the pre-check
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === '23505'
      ) {
        throw new ConflictException('EMAIL_EXISTS');
      }
      throw err;
    }

    // Send verification email after transaction commit
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000').split(',')[0].trim();
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${rawToken}`;

    await this.emailService.sendMail(
      savedUser.email,
      'E-posta adresinizi doğrulayın — lalabits.art',
      `<p>Merhaba ${savedUser.display_name},</p>
       <p>Hesabınızı etkinleştirmek için aşağıdaki butona tıklayın:</p>
       <p style="margin: 24px 0;">
         <a href="${verificationLink}"
            style="background:#008080;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">
           E-postamı doğrula
         </a>
       </p>
       <p>Bu bağlantı <strong>24 saat</strong> geçerlidir.</p>
       <p style="color:#6B7280;font-size:13px;">
         Eğer bu hesabı siz oluşturmadıysanız bu e-postayı görmezden gelebilirsiniz.
       </p>`,
    );

    return {
      id: savedUser.id,
      email: savedUser.email,
      display_name: savedUser.display_name,
    };
  }

  async registerCreator(
    dto: RegisterFanDto,
    ipAddress: string | null = null,
  ): Promise<{ id: string; email: string; display_name: string; creator_profile_id: string }> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException('EMAIL_EXISTS');
    }

    const password_hash = await bcrypt.hash(dto.password, 12);

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const now = new Date();

    let savedUser: User;
    let creatorProfileId: string;

    try {
      const result = await this.userRepository.manager.transaction(async (manager) => {
        const [tosVersion, ppVersion] = await Promise.all([
          manager.findOne(LegalDocumentVersion, {
            where: { document_type: LegalDocumentType.TermsOfService, is_current: true },
          }),
          manager.findOne(LegalDocumentVersion, {
            where: { document_type: LegalDocumentType.PrivacyPolicy, is_current: true },
          }),
        ]);

        if (!tosVersion || !ppVersion) {
          throw new InternalServerErrorException('LEGAL_VERSIONS_MISSING');
        }

        const user = await manager.save(
          manager.create(User, {
            email: dto.email,
            password_hash,
            display_name: dto.display_name,
            has_fan_role: true,
            is_admin: false,
            account_status: UserAccountStatus.Active,
          }),
        );

        const profile = await manager.save(
          manager.create(CreatorProfile, {
            user_id: user.id,
            display_name: dto.display_name,
            status: CreatorProfileStatus.Onboarding,
            onboarding_last_step: 0,
            username: null,
          }),
        );

        await manager.save(ConsentRecord, [
          manager.create(ConsentRecord, {
            user_id: user.id,
            document_type: LegalDocumentType.TermsOfService,
            legal_document_version_id: tosVersion.id,
            consented_at: now,
            consent_method: ConsentMethod.CreatorSignupEmail,
            ip_address: ipAddress,
          }),
          manager.create(ConsentRecord, {
            user_id: user.id,
            document_type: LegalDocumentType.PrivacyPolicy,
            legal_document_version_id: ppVersion.id,
            consented_at: now,
            consent_method: ConsentMethod.CreatorSignupEmail,
            ip_address: ipAddress,
          }),
        ]);

        await manager.save(
          manager.create(EmailVerificationToken, {
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: expiresAt,
            used_at: null,
          }),
        );

        return { user, profile };
      });

      savedUser = result.user;
      creatorProfileId = result.profile.id;
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === '23505'
      ) {
        throw new ConflictException('EMAIL_EXISTS');
      }
      throw err;
    }

    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000').split(',')[0].trim();
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${rawToken}`;

    await this.emailService.sendMail(
      savedUser.email,
      'E-posta adresinizi doğrulayın — lalabits.art',
      `<p>Merhaba ${savedUser.display_name},</p>
       <p>Yaratıcı hesabınızı etkinleştirmek için aşağıdaki butona tıklayın:</p>
       <p style="margin: 24px 0;">
         <a href="${verificationLink}"
            style="background:#008080;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">
           E-postamı doğrula
         </a>
       </p>
       <p>Bu bağlantı <strong>24 saat</strong> geçerlidir.</p>
       <p style="color:#6B7280;font-size:13px;">
         Eğer bu hesabı siz oluşturmadıysanız bu e-postayı görmezden gelebilirsiniz.
       </p>`,
    );

    return {
      id: savedUser.id,
      email: savedUser.email,
      display_name: savedUser.display_name,
      creator_profile_id: creatorProfileId,
    };
  }

  async verifyEmail(rawToken: string): Promise<void> {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const now = new Date();

    const verificationToken = await this.emailVerificationTokenRepository.findOne({
      where: { token_hash: tokenHash },
    });

    if (
      !verificationToken ||
      verificationToken.expires_at < now ||
      verificationToken.used_at !== null
    ) {
      throw new BadRequestException('INVALID_OR_EXPIRED_TOKEN');
    }

    const user = await this.userRepository.findOne({
      where: { id: verificationToken.user_id },
      withDeleted: false,
    });

    if (!user) {
      throw new BadRequestException('INVALID_OR_EXPIRED_TOKEN');
    }

    if (user.email_verified_at !== null) {
      throw new ConflictException('ALREADY_VERIFIED');
    }

    await this.userRepository.manager.transaction(async (manager) => {
      await manager.update(User, { id: user.id }, { email_verified_at: now });
      await manager.update(
        EmailVerificationToken,
        { id: verificationToken.id },
        { used_at: now },
      );
    });
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: false,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.email_verified_at !== null) {
      throw new ConflictException('ALREADY_VERIFIED');
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.emailVerificationTokenRepository.save(
      this.emailVerificationTokenRepository.create({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
        used_at: null,
      }),
    );

    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000').split(',')[0].trim();
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${rawToken}`;

    await this.emailService.sendMail(
      user.email,
      'E-posta adresinizi doğrulayın — lalabits.art',
      `<p>Merhaba ${user.display_name},</p>
       <p>Yeni doğrulama bağlantınız aşağıdadır:</p>
       <p style="margin: 24px 0;">
         <a href="${verificationLink}"
            style="background:#008080;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">
           E-postamı doğrula
         </a>
       </p>
       <p>Bu bağlantı <strong>24 saat</strong> geçerlidir.</p>
       <p style="color:#6B7280;font-size:13px;">
         Eğer bu hesabı siz oluşturmadıysanız bu e-postayı görmezden gelebilirsiniz.
       </p>`,
    );
  }

  async requestPasswordReset(dto: PasswordResetRequestDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      withDeleted: false,
    });

    // Always return without revealing whether the email exists
    if (!user) {
      return;
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.passwordResetTokenRepository.save(
      this.passwordResetTokenRepository.create({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
        used_at: null,
      }),
    );

    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000').split(',')[0].trim();
    const resetLink = `${frontendUrl}/auth/reset-password?token=${rawToken}`;

    await this.emailService.sendMail(
      user.email,
      'Şifrenizi sıfırlayın — lalabits.art',
      `<p>Merhaba ${user.display_name},</p>
       <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
       <p style="margin: 24px 0;">
         <a href="${resetLink}"
            style="background:#008080;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">
           Şifremi sıfırla
         </a>
       </p>
       <p>Bu bağlantı <strong>1 saat</strong> geçerlidir.</p>
       <p style="color:#6B7280;font-size:13px;">
         Eğer bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
         Şifreniz değiştirilmeyecektir.
       </p>`,
    );
  }

  async confirmPasswordReset(dto: PasswordResetConfirmDto): Promise<void> {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');
    const now = new Date();

    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { token_hash: tokenHash },
    });

    if (
      !resetToken ||
      resetToken.expires_at < now ||
      resetToken.used_at !== null
    ) {
      throw new BadRequestException('INVALID_OR_EXPIRED_TOKEN');
    }

    const user = await this.userRepository.findOne({
      where: { id: resetToken.user_id },
      withDeleted: false,
    });

    if (!user) {
      throw new BadRequestException('INVALID_OR_EXPIRED_TOKEN');
    }

    const newPasswordHash = await bcrypt.hash(dto.new_password, 12);

    await this.userRepository.manager.transaction(async (manager) => {
      await manager.update(User, { id: user.id }, { password_hash: newPasswordHash });
      await manager.update(
        PasswordResetToken,
        { id: resetToken.id },
        { used_at: now },
      );
    });

    // Invalidate all active refresh token sessions for this user
    const sessionKeys = await this.redis.keys(`${REFRESH_KEY_PREFIX}:${user.id}:*`);
    if (sessionKeys.length > 0) {
      await this.redis.del(...sessionKeys);
    }
  }

  async login(dto: LoginDto): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      withDeleted: false,
    });

    // Constant-time-safe: always run compare even if user not found
    const dummyHash = '$2a$12$invalidhashpadding000000000000000000000000000000000000000';
    const storedHash = user?.password_hash ?? dummyHash;
    const passwordMatch = await bcrypt.compare(dto.password, storedHash);

    if (!user || !user.password_hash || !passwordMatch) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    if (user.account_status === 'suspended') {
      throw new UnauthorizedException('ACCOUNT_SUSPENDED');
    }

    return this.issueTokenPair(user);
  }

  async adminLogin(dto: LoginDto): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      withDeleted: false,
    });

    // Constant-time-safe: always run compare even if user not found
    const dummyHash = '$2a$12$invalidhashpadding000000000000000000000000000000000000000';
    const storedHash = user?.password_hash ?? dummyHash;
    const passwordMatch = await bcrypt.compare(dto.password, storedHash);

    if (!user || !user.password_hash || !passwordMatch) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    // OD-22: is_admin must be true; fan-issued tokens must not access admin routes
    if (!user.is_admin) {
      throw new ForbiddenException('NOT_ADMIN');
    }

    if (user.account_status === 'suspended') {
      throw new UnauthorizedException('ACCOUNT_SUSPENDED');
    }

    return this.issueTokenPair(user, 'admin');
  }

  async refresh(dto: RefreshTokenDto): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    let payload: JwtRefreshPayload;

    try {
      payload = this.jwtService.verify<JwtRefreshPayload>(dto.refresh_token);
    } catch {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    const redisKey = this.refreshKey(payload.sub, payload.tokenId);
    const storedHash = await this.redis.get(redisKey);

    if (!storedHash) {
      throw new UnauthorizedException('REFRESH_TOKEN_REVOKED');
    }

    const presentedHash = this.hashToken(dto.refresh_token);
    if (storedHash !== presentedHash) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      withDeleted: false,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.account_status === 'suspended') {
      throw new UnauthorizedException('ACCOUNT_SUSPENDED');
    }

    // Rotate: revoke old token before issuing new pair
    await this.redis.del(redisKey);

    return this.issueTokenPair(user);
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['creator_profile'],
      withDeleted: false,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const cp = user.creator_profile as
      | { id: string; username: string; display_name: string; avatar_url: string | null; status: string }
      | null
      | undefined;

    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      has_fan_role: user.has_fan_role,
      is_admin: user.is_admin,
      email_verified_at: user.email_verified_at,
      account_status: user.account_status,
      created_at: user.created_at,
      creator_profile: cp
        ? {
            id: cp.id,
            username: cp.username,
            display_name: cp.display_name,
            avatar_url: cp.avatar_url,
            status: cp.status,
          }
        : null,
    };
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: false,
    });
    if (!user) throw new UnauthorizedException();

    const updates: Partial<User> = {};
    if (dto.display_name !== undefined) {
      updates.display_name = dto.display_name.trim();
    }

    let avatarUploadUrl: string | undefined;
    if (dto.avatar_filename && dto.avatar_content_type) {
      const ext = dto.avatar_filename.split('.').pop() ?? 'bin';
      const key = `avatars/users/${userId}/${randomUUID()}.${ext}`;
      avatarUploadUrl = await this.storageService.getPresignedPutUrl(key, dto.avatar_content_type);
      updates.avatar_url = key;
    }

    if (Object.keys(updates).length > 0) {
      await this.userRepository.update({ id: userId }, updates as object);
    }

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: false,
    });

    const avatarUrl = updatedUser?.avatar_url
      ? await this.storageService.getSignedGetUrl(updatedUser.avatar_url)
      : null;

    return {
      display_name: updatedUser?.display_name ?? user.display_name,
      avatar_url: avatarUrl,
      ...(avatarUploadUrl ? { avatar_upload_url: avatarUploadUrl } : {}),
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: false,
    });
    if (!user || !user.password_hash) throw new UnauthorizedException();

    const match = await bcrypt.compare(dto.current_password, user.password_hash);
    if (!match) throw new ForbiddenException('INVALID_CURRENT_PASSWORD');

    const newHash = await bcrypt.hash(dto.new_password, 12);
    await this.userRepository.update({ id: userId }, { password_hash: newHash });
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: false,
    });
    if (!user || !user.password_hash) throw new UnauthorizedException();

    const match = await bcrypt.compare(dto.password, user.password_hash);
    if (!match) throw new ForbiddenException('INVALID_PASSWORD');

    await this.userRepository.softDelete({ id: userId });

    // Invalidate all active refresh token sessions
    const sessionKeys = await this.redis.keys(`${REFRESH_KEY_PREFIX}:${userId}:*`);
    if (sessionKeys.length > 0) {
      await this.redis.del(...sessionKeys);
    }
  }

  async logout(dto: RefreshTokenDto): Promise<void> {
    let payload: JwtRefreshPayload;

    try {
      payload = this.jwtService.verify<JwtRefreshPayload>(dto.refresh_token);
    } catch {
      // Token expired or invalid — treat as already logged out, not an error
      return;
    }

    if (payload.type !== 'refresh') {
      return;
    }

    await this.redis.del(this.refreshKey(payload.sub, payload.tokenId));
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async issueTokenPair(
    user: User,
    scope?: 'admin',
  ): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      is_admin: user.is_admin,
      ...(scope ? { scope } : {}),
    };

    const tokenId = randomUUID();
    const refreshPayload: JwtRefreshPayload = {
      sub: user.id,
      tokenId,
      type: 'refresh',
    };

    const access_token = this.jwtService.sign(accessPayload, {
      expiresIn: this.accessTtl,
    });

    const refresh_token = this.jwtService.sign(refreshPayload, {
      expiresIn: this.refreshTtl,
    });

    await this.redis.set(
      this.refreshKey(user.id, tokenId),
      this.hashToken(refresh_token),
      this.refreshTtl,
    );

    return { access_token, refresh_token, expires_in: this.accessTtl };
  }

  private refreshKey(userId: string, tokenId: string): string {
    return `${REFRESH_KEY_PREFIX}:${userId}:${tokenId}`;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
