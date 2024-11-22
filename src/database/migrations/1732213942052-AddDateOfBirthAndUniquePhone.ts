import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateOfBirthAndUniquePhone1732213942052
  implements MigrationInterface
{
  name = 'AddDateOfBirthAndUniquePhone1732213942052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "FK_profile_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'youth'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "UQ_a24972ebd73b106250713dcddd9" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "skills" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "stakeholderLinks" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "stakeholderLinks" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "stakeholderLinks" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "stakeholderLinks" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "skills" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "UQ_a24972ebd73b106250713dcddd9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_profile_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
