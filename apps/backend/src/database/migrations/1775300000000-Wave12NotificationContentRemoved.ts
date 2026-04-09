import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave12NotificationContentRemoved1775300000000 implements MigrationInterface {
  name = 'Wave12NotificationContentRemoved1775300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add content_removed to notification type enum (PostgreSQL ADD VALUE must run outside transaction)
    await queryRunner.query(
      `ALTER TYPE "public"."notifications_notification_type_enum" ADD VALUE IF NOT EXISTS 'content_removed'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL does not support removing enum values — no-op
  }
}
