import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave27Kvkk1775900001000 implements MigrationInterface {
  name = 'Wave27Kvkk1775900001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kvkk_requests_request_type_enum') THEN
          CREATE TYPE kvkk_requests_request_type_enum AS ENUM (
            'data_access', 'data_deletion', 'data_correction', 'opt_out', 'other'
          );
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kvkk_requests_status_enum') THEN
          CREATE TYPE kvkk_requests_status_enum AS ENUM (
            'pending', 'in_review', 'completed', 'rejected'
          );
        END IF;
      END $$
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS kvkk_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        full_name VARCHAR(200) NOT NULL,
        email VARCHAR(300) NOT NULL,
        request_type kvkk_requests_request_type_enum NOT NULL,
        details TEXT,
        status kvkk_requests_status_enum NOT NULL DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_kvkk_requests_status
        ON kvkk_requests (status, created_at DESC)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS kvkk_requests`);
    await queryRunner.query(`DROP TYPE IF EXISTS kvkk_requests_request_type_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS kvkk_requests_status_enum`);
  }
}
