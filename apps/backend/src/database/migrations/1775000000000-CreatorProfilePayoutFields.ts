import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatorProfilePayoutFields1775000000000
  implements MigrationInterface
{
  name = 'CreatorProfilePayoutFields1775000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creator_profiles" ADD "payout_iban_encrypted" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_profiles" ADD "payout_iban_last_four" character varying(4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_profiles" ADD "payout_iban_format_valid" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creator_profiles" DROP COLUMN "payout_iban_format_valid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_profiles" DROP COLUMN "payout_iban_last_four"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_profiles" DROP COLUMN "payout_iban_encrypted"`,
    );
  }
}
