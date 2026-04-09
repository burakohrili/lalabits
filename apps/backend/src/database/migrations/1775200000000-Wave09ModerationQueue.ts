import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave09ModerationQueue1775200000000 implements MigrationInterface {
  name = 'Wave09ModerationQueue1775200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL enum ALTER requires ADD VALUE outside of transactions
    await queryRunner.query(
      `ALTER TYPE moderation_actions_action_type_enum ADD VALUE IF NOT EXISTS 'restore_content'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL does not support removing enum values — down is intentionally a no-op
    // To fully rollback: recreate the enum without 'restore_content' and update the column
  }
}
