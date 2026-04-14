import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave18NotificationPreferences1775800000000 implements MigrationInterface {
  name = 'Wave18NotificationPreferences1775800000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_preferences_notification_type_enum') THEN
          CREATE TYPE notification_preferences_notification_type_enum AS ENUM (
            'new_post_published',
            'new_product_published',
            'membership_renewal_success',
            'membership_renewal_failed',
            'membership_cancelled_confirmed',
            'membership_expired',
            'creator_application_approved',
            'creator_application_rejected',
            'admin_broadcast',
            'order_confirmed',
            'content_removed'
          );
        END IF;
      END $$
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS notification_preferences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        notification_type notification_preferences_notification_type_enum NOT NULL,
        email_enabled BOOLEAN NOT NULL DEFAULT true,
        in_app_enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT uq_notification_preferences_user_type UNIQUE (user_id, notification_type)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id
        ON notification_preferences (user_id)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS notification_preferences`);
    await queryRunner.query(`DROP TYPE IF EXISTS notification_preferences_notification_type_enum`);
  }
}
