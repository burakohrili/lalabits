import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMilestoneSystem1777835947754 implements MigrationInterface {
    name = 'AddMilestoneSystem1777835947754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."notifications_notification_type_enum" RENAME TO "notifications_notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_notification_type_enum" AS ENUM('new_post_published', 'new_product_published', 'membership_renewal_success', 'membership_renewal_failed', 'membership_cancelled_confirmed', 'membership_expired', 'creator_application_approved', 'creator_application_rejected', 'admin_broadcast', 'order_confirmed', 'content_removed', 'membership_resumed', 'milestone_unlocked')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "notification_type" TYPE "public"."notifications_notification_type_enum" USING "notification_type"::"text"::"public"."notifications_notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_notification_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "UQ_f22207503ea3210d2c18182cd4f"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_notification_type_enum" RENAME TO "notification_preferences_notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_notification_type_enum" AS ENUM('new_post_published', 'new_product_published', 'membership_renewal_success', 'membership_renewal_failed', 'membership_cancelled_confirmed', 'membership_expired', 'creator_application_approved', 'creator_application_rejected', 'admin_broadcast', 'order_confirmed', 'content_removed', 'membership_resumed', 'milestone_unlocked')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "notification_type" TYPE "public"."notification_preferences_notification_type_enum" USING "notification_type"::"text"::"public"."notification_preferences_notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_notification_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "UQ_f22207503ea3210d2c18182cd4f" UNIQUE ("user_id", "notification_type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "UQ_f22207503ea3210d2c18182cd4f"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_notification_type_enum_old" AS ENUM('new_post_published', 'new_product_published', 'membership_renewal_success', 'membership_renewal_failed', 'membership_cancelled_confirmed', 'membership_expired', 'creator_application_approved', 'creator_application_rejected', 'admin_broadcast', 'order_confirmed', 'content_removed', 'membership_resumed')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "notification_type" TYPE "public"."notification_preferences_notification_type_enum_old" USING "notification_type"::"text"::"public"."notification_preferences_notification_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_notification_type_enum_old" RENAME TO "notification_preferences_notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "UQ_f22207503ea3210d2c18182cd4f" UNIQUE ("user_id", "notification_type")`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_notification_type_enum_old" AS ENUM('new_post_published', 'new_product_published', 'membership_renewal_success', 'membership_renewal_failed', 'membership_cancelled_confirmed', 'membership_expired', 'creator_application_approved', 'creator_application_rejected', 'admin_broadcast', 'order_confirmed', 'content_removed', 'membership_resumed')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "notification_type" TYPE "public"."notifications_notification_type_enum_old" USING "notification_type"::"text"::"public"."notifications_notification_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notifications_notification_type_enum_old" RENAME TO "notifications_notification_type_enum"`);
    }

}
