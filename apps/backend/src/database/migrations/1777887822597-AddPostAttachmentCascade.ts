import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostAttachmentCascade1777887822597 implements MigrationInterface {
    name = 'AddPostAttachmentCascade1777887822597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_attachments" DROP CONSTRAINT "FK_4423ea1009e33b8a0a39a8b05af"`);
        await queryRunner.query(`ALTER TABLE "post_attachments" ADD CONSTRAINT "FK_4423ea1009e33b8a0a39a8b05af" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_attachments" DROP CONSTRAINT "FK_4423ea1009e33b8a0a39a8b05af"`);
        await queryRunner.query(`ALTER TABLE "post_attachments" ADD CONSTRAINT "FK_4423ea1009e33b8a0a39a8b05af" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
