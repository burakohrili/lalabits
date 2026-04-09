import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { OAuthAccount } from './entities/oauth-account.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { ConsentRecord } from '../legal/entities/consent-record.entity';
import { LegalDocumentVersion } from '../legal/entities/legal-document-version.entity';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminAuthController } from './admin-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OAuthAccount,
      PasswordResetToken,
      EmailVerificationToken,
      ConsentRecord,
      LegalDocumentVersion,
      CreatorProfile,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            config.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL'),
            10,
          ),
        },
      }),
    }),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController, AdminAuthController],
  exports: [TypeOrmModule, JwtModule, PassportModule, AuthService],
})
export class AuthModule {}
