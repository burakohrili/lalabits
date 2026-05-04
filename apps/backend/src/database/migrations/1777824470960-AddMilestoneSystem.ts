import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMilestoneSystem1777824470960 implements MigrationInterface {
    name = 'AddMilestoneSystem1777824470960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "notification_preferences_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "user_blocks" DROP CONSTRAINT "user_blocks_blocker_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "user_blocks" DROP CONSTRAINT "user_blocks_blocked_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "kvkk_requests" DROP CONSTRAINT "kvkk_requests_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" DROP CONSTRAINT "post_checklist_progress_post_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" DROP CONSTRAINT "post_checklist_progress_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" DROP CONSTRAINT "payment_disputes_fan_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" DROP CONSTRAINT "payment_disputes_invoice_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" DROP CONSTRAINT "payment_disputes_subscription_id_fkey"`);
        await queryRunner.query(`DROP INDEX "public"."idx_notification_preferences_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_blocks_blocker"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_blocks_blocked"`);
        await queryRunner.query(`DROP INDEX "public"."idx_kvkk_requests_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_post_checklist_progress_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_community_messages_profile_created"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_chat_messages_conversation_created"`);
        await queryRunner.query(`DROP INDEX "public"."idx_blog_posts_status_published_at"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_orders_gateway_conversation_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_payment_disputes_fan_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_payment_disputes_status"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "uq_notification_preferences_user_type"`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" DROP CONSTRAINT "uq_post_checklist_progress"`);
        await queryRunner.query(`ALTER TABLE "chat_conversations" DROP CONSTRAINT "UQ_chat_conversations_creator_fan"`);
        await queryRunner.query(`CREATE TABLE "fan_milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fan_id" uuid NOT NULL, "related_creator_id" uuid, "type" character varying NOT NULL, "certificate_url" character varying, "share_text" text NOT NULL, "earned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "notified_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_38f8d0eb56f140bfcb41395341e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_05752b8371b1caca5c1aafcae0" ON "fan_milestones" ("fan_id", "type", "related_creator_id") `);
        await queryRunner.query(`CREATE TABLE "creator_milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creator_id" uuid NOT NULL, "type" character varying NOT NULL, "certificate_url" character varying, "share_text" text NOT NULL, "earned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "notified_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2c7a3b76f640d3024f716edbc5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_77826d7094a686046e5d92d7ff" ON "creator_milestones" ("creator_id", "type") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "fan_rank" integer`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "creator_rank" integer`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_notification_type_enum" RENAME TO "notification_preferences_notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_notification_type_enum" AS ENUM('new_post_published', 'new_product_published', 'membership_renewal_success', 'membership_renewal_failed', 'membership_cancelled_confirmed', 'membership_expired', 'creator_application_approved', 'creator_application_rejected', 'admin_broadcast', 'order_confirmed', 'content_removed', 'membership_resumed')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "notification_type" TYPE "public"."notification_preferences_notification_type_enum" USING "notification_type"::"text"::"public"."notification_preferences_notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_notification_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ALTER COLUMN "content" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "UQ_514e682fffc8df32cfb83e56002" UNIQUE ("gateway_conversation_id")`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "UQ_f22207503ea3210d2c18182cd4f" UNIQUE ("user_id", "notification_type")`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" ADD CONSTRAINT "UQ_71dd163109a002e748d8f1333f5" UNIQUE ("post_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "kvkk_requests" ADD CONSTRAINT "FK_6614141a0bae9a397e2b8dc1cd6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fan_milestones" ADD CONSTRAINT "FK_8038f6542b94eecf60cb8adf7c9" FOREIGN KEY ("fan_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fan_milestones" ADD CONSTRAINT "FK_0394d4caadd6b208c8aefca8ed7" FOREIGN KEY ("related_creator_id") REFERENCES "creator_profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creator_milestones" ADD CONSTRAINT "FK_ef72090d9370f664f7f23ce977c" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" ADD CONSTRAINT "FK_eb6980c5d723dad5e64b26a92c3" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" ADD CONSTRAINT "FK_178c00b461ecfa354b06d7c393e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" ADD CONSTRAINT "FK_78f2749f4de8f092f4d785ab808" FOREIGN KEY ("fan_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" ADD CONSTRAINT "FK_831e82efbfb1fca53a3c8ddac5f" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" ADD CONSTRAINT "FK_3402d41b2d8c16baff796999d7e" FOREIGN KEY ("subscription_id") REFERENCES "membership_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_disputes" DROP CONSTRAINT "FK_3402d41b2d8c16baff796999d7e"`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" DROP CONSTRAINT "FK_831e82efbfb1fca53a3c8ddac5f"`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" DROP CONSTRAINT "FK_78f2749f4de8f092f4d785ab808"`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" DROP CONSTRAINT "FK_178c00b461ecfa354b06d7c393e"`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" DROP CONSTRAINT "FK_eb6980c5d723dad5e64b26a92c3"`);
        await queryRunner.query(`ALTER TABLE "creator_milestones" DROP CONSTRAINT "FK_ef72090d9370f664f7f23ce977c"`);
        await queryRunner.query(`ALTER TABLE "fan_milestones" DROP CONSTRAINT "FK_0394d4caadd6b208c8aefca8ed7"`);
        await queryRunner.query(`ALTER TABLE "fan_milestones" DROP CONSTRAINT "FK_8038f6542b94eecf60cb8adf7c9"`);
        await queryRunner.query(`ALTER TABLE "kvkk_requests" DROP CONSTRAINT "FK_6614141a0bae9a397e2b8dc1cd6"`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" DROP CONSTRAINT "UQ_71dd163109a002e748d8f1333f5"`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "UQ_f22207503ea3210d2c18182cd4f"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "UQ_514e682fffc8df32cfb83e56002"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ALTER COLUMN "content" SET DEFAULT ''`);
        await queryRunner.query(`CREATE TYPE "public"."notification_preferences_notification_type_enum_old" AS ENUM('new_post_published', 'new_product_published', 'membership_renewal_success', 'membership_renewal_failed', 'membership_cancelled_confirmed', 'membership_expired', 'creator_application_approved', 'creator_application_rejected', 'admin_broadcast', 'order_confirmed', 'content_removed')`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ALTER COLUMN "notification_type" TYPE "public"."notification_preferences_notification_type_enum_old" USING "notification_type"::"text"::"public"."notification_preferences_notification_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_preferences_notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_preferences_notification_type_enum_old" RENAME TO "notification_preferences_notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "creator_rank"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fan_rank"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_77826d7094a686046e5d92d7ff"`);
        await queryRunner.query(`DROP TABLE "creator_milestones"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_05752b8371b1caca5c1aafcae0"`);
        await queryRunner.query(`DROP TABLE "fan_milestones"`);
        await queryRunner.query(`ALTER TABLE "chat_conversations" ADD CONSTRAINT "UQ_chat_conversations_creator_fan" UNIQUE ("creator_profile_id", "fan_user_id")`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" ADD CONSTRAINT "uq_post_checklist_progress" UNIQUE ("post_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "uq_notification_preferences_user_type" UNIQUE ("user_id", "notification_type")`);
        await queryRunner.query(`CREATE INDEX "idx_payment_disputes_status" ON "payment_disputes" ("created_at", "status") `);
        await queryRunner.query(`CREATE INDEX "idx_payment_disputes_fan_user_id" ON "payment_disputes" ("created_at", "fan_user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_orders_gateway_conversation_id" ON "orders" ("gateway_conversation_id") WHERE (gateway_conversation_id IS NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "idx_blog_posts_status_published_at" ON "blog_posts" ("published_at", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_chat_messages_conversation_created" ON "chat_messages" ("conversation_id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_community_messages_profile_created" ON "community_messages" ("created_at", "creator_profile_id") `);
        await queryRunner.query(`CREATE INDEX "idx_post_checklist_progress_user_id" ON "post_checklist_progress" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_kvkk_requests_status" ON "kvkk_requests" ("created_at", "status") `);
        await queryRunner.query(`CREATE INDEX "idx_user_blocks_blocked" ON "user_blocks" ("blocked_user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_user_blocks_blocker" ON "user_blocks" ("blocker_user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_notification_preferences_user_id" ON "notification_preferences" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "payment_disputes" ADD CONSTRAINT "payment_disputes_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "membership_subscriptions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" ADD CONSTRAINT "payment_disputes_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_disputes" ADD CONSTRAINT "payment_disputes_fan_user_id_fkey" FOREIGN KEY ("fan_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" ADD CONSTRAINT "post_checklist_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_checklist_progress" ADD CONSTRAINT "post_checklist_progress_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kvkk_requests" ADD CONSTRAINT "kvkk_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_user_id_fkey" FOREIGN KEY ("blocker_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
