import { MigrationInterface, QueryRunner } from 'typeorm';

export class AgreementAndConsentTables1778200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "creator_agreements" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "creator_id" uuid NOT NULL REFERENCES "creator_profiles"("id") ON DELETE CASCADE,
        "agreement_version" character varying NOT NULL,
        "agreed_at" timestamptz NOT NULL,
        "ip_address" character varying,
        "user_agent" text,
        "agreement_hash" character varying NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_creator_agreements_creator_id"
      ON "creator_agreements" ("creator_id")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "fan_consents" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "consent_version" character varying NOT NULL,
        "consented_at" timestamptz NOT NULL,
        "ip_address" character varying,
        "user_agent" text,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_fan_consents_user_id"
      ON "fan_consents" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "fan_consents"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "creator_agreements"`);
  }
}
