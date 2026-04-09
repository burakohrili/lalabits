import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave08PaymentGateway1775100000000 implements MigrationInterface {
  name = 'Wave08PaymentGateway1775100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── orders: add gateway_conversation_id ─────────────────────────────────
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "gateway_conversation_id" character varying`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_orders_gateway_conversation_id"
       ON "orders" ("gateway_conversation_id")
       WHERE "gateway_conversation_id" IS NOT NULL`,
    );

    // ── membership_subscriptions: make gateway_subscription_id nullable ──────
    // Initial migration created it as NOT NULL. Real gateway IDs arrive after
    // checkout callback. Pending subscriptions have no gateway ID yet.
    await queryRunner.query(
      `ALTER TABLE "membership_subscriptions"
       ALTER COLUMN "gateway_subscription_id" DROP NOT NULL`,
    );

    // ── membership_plans: add gateway_plan_reference ─────────────────────────
    // Populated once when İyzico subscription pricing plan is provisioned.
    await queryRunner.query(
      `ALTER TABLE "membership_plans" ADD "gateway_plan_reference" character varying`,
    );

    // ── webhook_events: idempotency log ──────────────────────────────────────
    await queryRunner.query(
      `CREATE TABLE "webhook_events" (
        "id"               uuid NOT NULL DEFAULT uuid_generate_v4(),
        "gateway"          character varying NOT NULL,
        "event_type"       character varying NOT NULL,
        "idempotency_key"  character varying NOT NULL,
        "raw_payload"      jsonb NOT NULL,
        "processed"        boolean NOT NULL DEFAULT false,
        "processed_at"     TIMESTAMP WITH TIME ZONE,
        "error"            text,
        "created_at"       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_webhook_events" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_webhook_events_idempotency_key" UNIQUE ("idempotency_key")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "webhook_events"`);

    await queryRunner.query(
      `ALTER TABLE "membership_plans" DROP COLUMN "gateway_plan_reference"`,
    );

    await queryRunner.query(
      `ALTER TABLE "membership_subscriptions"
       ALTER COLUMN "gateway_subscription_id" SET NOT NULL`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_orders_gateway_conversation_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "gateway_conversation_id"`,
    );
  }
}
