import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubscriptionConsents1778400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscription_consents" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "subscription_id" uuid NOT NULL REFERENCES "membership_subscriptions"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "consent_version" character varying NOT NULL,
        "consented_at" timestamptz NOT NULL,
        "billing_descriptor" character varying,
        "ip_address" character varying,
        "user_agent" text,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_subscription_consents_subscription_id"
      ON "subscription_consents" ("subscription_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_subscription_consents_user_id"
      ON "subscription_consents" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "subscription_consents"`);
  }
}
