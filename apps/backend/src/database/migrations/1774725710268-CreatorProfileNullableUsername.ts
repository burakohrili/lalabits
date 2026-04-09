import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatorProfileNullableUsername1774725710268 implements MigrationInterface {
    name = 'CreatorProfileNullableUsername1774725710268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_profiles" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ALTER COLUMN "category" SET DEFAULT 'other'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_profiles" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ALTER COLUMN "username" SET NOT NULL`);
    }

}
