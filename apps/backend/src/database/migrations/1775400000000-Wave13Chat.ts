import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave13Chat1775400000000 implements MigrationInterface {
  name = 'Wave13Chat1775400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Extend reports target_type enum ──────────────────────────────────────
    // ADD VALUE must run outside transaction (PostgreSQL constraint)
    await queryRunner.query(
      `ALTER TYPE "public"."reports_target_type_enum" ADD VALUE IF NOT EXISTS 'chat_message'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."reports_target_type_enum" ADD VALUE IF NOT EXISTS 'community_message'`,
    );

    // ── chat_conversations ───────────────────────────────────────────────────
    // One conversation per (creator_profile_id, fan_user_id) pair.
    // creator_user_id is denormalized to avoid joins on every list/unread query.
    await queryRunner.query(
      `CREATE TABLE "chat_conversations" (
        "id"                  uuid NOT NULL DEFAULT uuid_generate_v4(),
        "creator_profile_id"  uuid NOT NULL,
        "creator_user_id"     uuid NOT NULL,
        "fan_user_id"         uuid NOT NULL,
        "created_at"          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "last_message_at"     TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_chat_conversations" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_chat_conversations_creator_fan"
          UNIQUE ("creator_profile_id", "fan_user_id")
      )`,
    );

    // ── chat_messages ────────────────────────────────────────────────────────
    await queryRunner.query(
      `CREATE TABLE "chat_messages" (
        "id"              uuid NOT NULL DEFAULT uuid_generate_v4(),
        "conversation_id" uuid NOT NULL,
        "sender_user_id"  uuid NOT NULL,
        "body"            text NOT NULL,
        "created_at"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_messages" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_messages_conversation_created"
       ON "chat_messages" ("conversation_id", "created_at" DESC)`,
    );

    // ── chat_read_cursors ────────────────────────────────────────────────────
    await queryRunner.query(
      `CREATE TABLE "chat_read_cursors" (
        "conversation_id" uuid NOT NULL,
        "user_id"         uuid NOT NULL,
        "last_read_at"    TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_chat_read_cursors" PRIMARY KEY ("conversation_id", "user_id")
      )`,
    );

    // ── community_messages ───────────────────────────────────────────────────
    await queryRunner.query(
      `CREATE TABLE "community_messages" (
        "id"                  uuid NOT NULL DEFAULT uuid_generate_v4(),
        "creator_profile_id"  uuid NOT NULL,
        "sender_user_id"      uuid NOT NULL,
        "body"                text NOT NULL,
        "created_at"          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_community_messages" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_community_messages_profile_created"
       ON "community_messages" ("creator_profile_id", "created_at" DESC)`,
    );

    // ── community_read_cursors ───────────────────────────────────────────────
    await queryRunner.query(
      `CREATE TABLE "community_read_cursors" (
        "creator_profile_id"  uuid NOT NULL,
        "user_id"             uuid NOT NULL,
        "last_read_at"        TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_community_read_cursors" PRIMARY KEY ("creator_profile_id", "user_id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "community_read_cursors"`);
    await queryRunner.query(`DROP TABLE "community_messages"`);
    await queryRunner.query(`DROP TABLE "chat_read_cursors"`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(`DROP TABLE "chat_conversations"`);
    // Enum value removal not supported in PostgreSQL — no-op
  }
}
