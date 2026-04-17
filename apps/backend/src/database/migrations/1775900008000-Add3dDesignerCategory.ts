import { MigrationInterface, QueryRunner } from 'typeorm';

export class Add3dDesignerCategory1775900008000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."creator_profiles_category_enum" ADD VALUE IF NOT EXISTS 'designer_3d'`,
    );
  }

  async down(): Promise<void> {
    // PostgreSQL ENUM değerleri silinemez
  }
}
