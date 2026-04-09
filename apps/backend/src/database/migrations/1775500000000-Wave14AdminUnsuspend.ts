import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Wave 14 — Admin Creator Management
 * Adds `unsuspend_creator` to moderation_actions_action_type_enum.
 * ADD VALUE must run outside a transaction block (PostgreSQL constraint).
 */
export class Wave14AdminUnsuspend1775500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Commit any implicit transaction before ALTER TYPE
    await queryRunner.query(`COMMIT`);

    await queryRunner.query(`
      ALTER TYPE moderation_actions_action_type_enum
      ADD VALUE IF NOT EXISTS 'unsuspend_creator'
    `);

    // Re-open transaction context for TypeORM's migration tracking
    await queryRunner.query(`BEGIN`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL does not support removing enum values; down is intentionally a no-op
  }
}
