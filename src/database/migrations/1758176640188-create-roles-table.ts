import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1758176640188 implements MigrationInterface {
  name = 'CreateRolesTable1758176640188';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "roles" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          "description" character varying,
          "permissions" jsonb NOT NULL DEFAULT '[]',
          "deleted_at" TIMESTAMP WITH TIME ZONE,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "created_by" character varying NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_by" character varying NOT NULL,
          CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
          CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "FK_user_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP CONSTRAINT "FK_user_role"
    `);
    await queryRunner.query(`
      DROP TABLE "roles"
    `);
  }
}
