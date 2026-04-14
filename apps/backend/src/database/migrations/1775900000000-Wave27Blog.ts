import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave27Blog1775900000000 implements MigrationInterface {
  name = 'Wave27Blog1775900000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blog_posts_status_enum') THEN
          CREATE TYPE blog_posts_status_enum AS ENUM ('draft', 'published');
        END IF;
      END $$
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(300) NOT NULL,
        slug VARCHAR(300) NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL DEFAULT '',
        cover_image_url VARCHAR(500),
        author_name VARCHAR(200) NOT NULL DEFAULT 'lalabits.art',
        status blog_posts_status_enum NOT NULL DEFAULT 'draft',
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at
        ON blog_posts (status, published_at DESC)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS blog_posts`);
    await queryRunner.query(`DROP TYPE IF EXISTS blog_posts_status_enum`);
  }
}
