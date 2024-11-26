import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfile1732034807528 implements MigrationInterface {
  name = 'CreateProfile1732034807528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" (
        "id" SERIAL NOT NULL, 
        "userId" integer NOT NULL, 
        "profileImage" character varying, 
        "skills" text array DEFAULT '{}', 
        "stakeholderLinks" jsonb, 
        "bio" text, 
        "location" character varying, 
        "phoneNumber" character varying, 
        "dateOfBirth" date, 
        "gender" character varying, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "UQ_1e68703b93fb4c02a2cef6003ca" UNIQUE ("phoneNumber"), 
        CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), 
        CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"),
        CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") 
          REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );

    // Add unique constraints to user table
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'youth'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop unique constraints from user table
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );

    // Drop profile table
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
