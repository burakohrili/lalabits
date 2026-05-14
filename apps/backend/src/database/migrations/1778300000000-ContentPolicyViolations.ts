import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContentPolicyViolations1778300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "violation_target_type_enum" AS ENUM ('post', 'product', 'collection', 'chat_message')
    `);

    await queryRunner.query(`
      CREATE TYPE "violation_type_enum" AS ENUM (
        'underage_content', 'obscene', 'ataturk_law', 'terror_propaganda', 'hate_speech', 'other'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "violation_severity_enum" AS ENUM ('warning', 'suspension', 'ban')
    `);

    await queryRunner.query(`
      CREATE TYPE "violation_status_enum" AS ENUM ('open', 'actioned', 'dismissed')
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "content_policy_violations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "target_type" "violation_target_type_enum" NOT NULL,
        "target_id" uuid NOT NULL,
        "creator_id" uuid NOT NULL REFERENCES "creator_profiles"("id") ON DELETE CASCADE,
        "violation_type" "violation_type_enum" NOT NULL,
        "severity" "violation_severity_enum" NOT NULL DEFAULT 'warning',
        "status" "violation_status_enum" NOT NULL DEFAULT 'open',
        "notes" text,
        "actioned_by" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "actioned_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_content_policy_violations_creator_id"
      ON "content_policy_violations" ("creator_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_content_policy_violations_status"
      ON "content_policy_violations" ("status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "content_policy_violations"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "violation_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "violation_severity_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "violation_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "violation_target_type_enum"`);
  }
}
