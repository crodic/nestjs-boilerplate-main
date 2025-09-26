import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionsTable1758176745032 implements MigrationInterface {
  name = 'CreateSessionsTable1758176745032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."sessions_loginscope_enum" AS ENUM('portal', 'client')
    `);

    await queryRunner.query(`
      CREATE TABLE "sessions" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "hash" character varying(255) NOT NULL,
          "user_id" uuid NOT NULL,
          "login_scope" "public"."sessions_loginscope_enum" NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "created_by" character varying NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_by" character varying NOT NULL,
          CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "sessions"
      ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_sessions_user_id" ON "sessions" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "public"."IDX_sessions_user_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "sessions" DROP CONSTRAINT "FK_session_user"
    `);

    await queryRunner.query(`
      DROP TABLE "sessions"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."sessions_loginscope_enum"
    `);
  }
}
