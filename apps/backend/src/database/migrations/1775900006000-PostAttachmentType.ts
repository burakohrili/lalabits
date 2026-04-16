import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostAttachmentType1775900006000 implements MigrationInterface {
  name = 'PostAttachmentType1775900006000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_attachments" ADD COLUMN IF NOT EXISTS "attachment_type" varchar NOT NULL DEFAULT 'file'`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_attachments" DROP COLUMN IF EXISTS "attachment_type"`,
    );
  }
}
