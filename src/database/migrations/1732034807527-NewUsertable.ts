import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewUsertable1732034807527 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table exists before creating
    const userTableExists = await queryRunner.hasTable('user');
    if (!userTableExists) {
      await queryRunner.query(`
                CREATE TABLE "user" (
                    "id" SERIAL NOT NULL,
                    "firstName" character varying NOT NULL,
                    "lastName" character varying NOT NULL,
                    "dateOfBirth" TIMESTAMP NOT NULL,
                    "gender" character varying NOT NULL,
                    "email" character varying NOT NULL,
                    "phoneNumber" character varying NOT NULL,
                    "age" integer NOT NULL,
                    "role" character varying NOT NULL,
                    "password" character varying NOT NULL,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                )
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
