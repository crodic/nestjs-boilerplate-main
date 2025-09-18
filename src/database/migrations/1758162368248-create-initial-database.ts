import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialDatabase1758162368248 implements MigrationInterface {
  name = 'CreateInitialDatabase1758162368248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying,
                "content" character varying,
                "user_id" uuid NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_post_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                "permissions" jsonb NOT NULL DEFAULT '[]',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."sessions_loginscope_enum" AS ENUM('portal', 'client')
        `);
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "hash" character varying(255) NOT NULL,
                "user_id" uuid NOT NULL,
                "loginScope" "public"."sessions_loginscope_enum" NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(50),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "bio" character varying NOT NULL DEFAULT '',
                "image" character varying NOT NULL DEFAULT '',
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "roleId" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_username" ON "users" ("username")
            WHERE "deleted_at" IS NULL
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_email" ON "users" ("email")
            WHERE "deleted_at" IS NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_post_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_session_user"
        `);
    await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_post_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."UQ_user_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."UQ_user_username"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."sessions_loginscope_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "roles"
        `);
    await queryRunner.query(`
            DROP TABLE "posts"
        `);
  }
}
