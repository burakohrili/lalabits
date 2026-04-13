import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Wave 17 — User Block System
 * Creates `user_blocks` table with unique constraint per blocker/blocked pair.
 */
export class Wave17UserBlocks1775700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_blocks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        blocker_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_user_blocks UNIQUE (blocker_user_id, blocked_user_id),
        CONSTRAINT chk_no_self_block CHECK (blocker_user_id != blocked_user_id)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker ON user_blocks (blocker_user_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked ON user_blocks (blocked_user_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user_blocks`);
  }
}
