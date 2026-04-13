import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Wave 16 — Creator Social Links
 * Adds `social_links` JSONB column to creator_profiles.
 */
export class Wave16SocialLinks1775600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE creator_profiles
      ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE creator_profiles DROP COLUMN IF EXISTS social_links
    `);
  }
}
