import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastReminderSentAt1778500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "membership_subscriptions"
      ADD COLUMN IF NOT EXISTS "last_reminder_sent_at" timestamptz
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "membership_subscriptions"
      DROP COLUMN IF EXISTS "last_reminder_sent_at"
    `);
  }
}
