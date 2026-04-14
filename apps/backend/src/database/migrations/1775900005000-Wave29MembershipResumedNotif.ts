import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave29MembershipResumedNotif1775900005000 implements MigrationInterface {
  name = 'Wave29MembershipResumedNotif1775900005000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "public"."notifications_notification_type_enum"
        ADD VALUE IF NOT EXISTS 'membership_resumed'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL does not support removing enum values without recreating the type.
    // To roll back: recreate the enum without 'membership_resumed' and cast the column.
  }
}
