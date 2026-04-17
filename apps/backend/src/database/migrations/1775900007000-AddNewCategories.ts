import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewCategories1775900007000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."creator_profiles_category_enum" ADD VALUE IF NOT EXISTS 'video_creator'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."creator_profiles_category_enum" ADD VALUE IF NOT EXISTS 'ai_creator'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."creator_profiles_category_enum" ADD VALUE IF NOT EXISTS 'game_developer'`,
    );
  }

  async down(): Promise<void> {
    // PostgreSQL ENUM değerleri silinemez
  }
}
