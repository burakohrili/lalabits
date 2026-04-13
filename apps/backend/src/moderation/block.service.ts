import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBlock } from './entities/user-block.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(UserBlock)
    private readonly blockRepo: Repository<UserBlock>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async blockUser(blockerId: string, blockedId: string): Promise<{ ok: true }> {
    if (blockerId === blockedId) {
      throw new UnprocessableEntityException('CANNOT_BLOCK_YOURSELF');
    }

    const targetExists = await this.userRepo.existsBy({ id: blockedId });
    if (!targetExists) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const existing = await this.blockRepo.findOne({
      where: { blocker_user_id: blockerId, blocked_user_id: blockedId },
    });
    if (existing) {
      throw new ConflictException('ALREADY_BLOCKED');
    }

    await this.blockRepo.save(
      this.blockRepo.create({ blocker_user_id: blockerId, blocked_user_id: blockedId }),
    );

    return { ok: true };
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<{ ok: true }> {
    const result = await this.blockRepo.delete({
      blocker_user_id: blockerId,
      blocked_user_id: blockedId,
    });

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('BLOCK_NOT_FOUND');
    }

    return { ok: true };
  }

  async listBlocked(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ items: BlockedUserItem[]; total: number; page: number; limit: number }> {
    const take = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * take;

    const [blocks, total] = await this.blockRepo.findAndCount({
      where: { blocker_user_id: userId },
      order: { created_at: 'DESC' },
      skip,
      take,
    });

    const blockedIds = blocks.map((b) => b.blocked_user_id);

    if (blockedIds.length === 0) {
      return { items: [], total, page, limit: take };
    }

    const users = await this.userRepo.find({
      where: blockedIds.map((id) => ({ id })),
      select: ['id', 'display_name', 'avatar_url'],
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const items: BlockedUserItem[] = blocks.map((b) => {
      const u = userMap.get(b.blocked_user_id);
      return {
        user_id: b.blocked_user_id,
        display_name: u?.display_name ?? 'Kullanıcı',
        avatar_url: u?.avatar_url ?? null,
        blocked_at: b.created_at,
      };
    });

    return { items, total, page, limit: take };
  }

  async isBlocked(viewerId: string, targetId: string): Promise<boolean> {
    const block = await this.blockRepo.findOne({
      where: [
        { blocker_user_id: viewerId, blocked_user_id: targetId },
        { blocker_user_id: targetId, blocked_user_id: viewerId },
      ],
    });
    return block !== null;
  }

  async getBlockedIds(userId: string): Promise<string[]> {
    const blocks = await this.blockRepo.find({
      where: { blocker_user_id: userId },
      select: ['blocked_user_id'],
    });
    return blocks.map((b) => b.blocked_user_id);
  }
}

export interface BlockedUserItem {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  blocked_at: Date;
}
