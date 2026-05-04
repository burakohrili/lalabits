import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostCoverImage1777900000000 implements MigrationInterface {
  name = 'AddPostCoverImage1777900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "cover_image_key" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN IF EXISTS "cover_image_key"`);
  }
}
