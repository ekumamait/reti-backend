import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestMigration1733926891480 implements MigrationInterface {
  name = 'TestMigration1733926891480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_notification_user"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP CONSTRAINT "FK_job_user"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_notification_user"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_job_employer"
        `);
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "category" character varying DEFAULT 'Uncategorized',
                "description" character varying NOT NULL,
                "price" numeric(10, 2) NOT NULL,
                "stockQuantity" integer NOT NULL DEFAULT '0',
                "imageUrl" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer,
                CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "profile" (
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
                "email" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "theme" character varying NOT NULL DEFAULT 'light',
                CONSTRAINT "UQ_1e68703b93fb4c02a2cef6003ca" UNIQUE ("phoneNumber"),
                CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"),
                CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "conversation" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "conversation" DROP COLUMN "updatedAt"
        `);
    await queryRunner.query(`
            ALTER TABLE "conversation"
            ADD "messages" jsonb
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "location" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "salary" json NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "qualifications" text array
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "interested" integer array
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "positions" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "experience" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "jobCategory" character varying NOT NULL
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."job_jobtype_enum" AS ENUM('fulltime', 'part-time', 'freelance')
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "jobType" "public"."job_jobtype_enum" NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "applicationDeadline" TIMESTAMP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "companyName" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "contactEmail" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "conversation"
            ALTER COLUMN "createdAt"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ADD "title" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification" DROP COLUMN "message"
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ADD "message" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ALTER COLUMN "isRead"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ALTER COLUMN "createdAt"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ALTER COLUMN "updatedAt"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "title" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "description" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "status" character varying NOT NULL DEFAULT 'active'
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "employerId"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "createdAt"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "updatedAt"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "firstName"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "firstName" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "lastName"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "lastName" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "user_phoneNumber_key"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phoneNumber"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phoneNumber" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber")
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" character varying NOT NULL DEFAULT 'youth'
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "createdAt"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "profileImage"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "profileImage" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD CONSTRAINT "UQ_fef189d2b21f6165e138bb85c99" UNIQUE ("title", "location", "employerId")
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD CONSTRAINT "FK_7cd310fbca5788bc794308210ab" FOREIGN KEY ("employerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "profile"
            ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP CONSTRAINT "FK_7cd310fbca5788bc794308210ab"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9"
        `);
    await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP CONSTRAINT "UQ_fef189d2b21f6165e138bb85c99"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "profileImage"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "profileImage" character varying(255)
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "createdAt" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" character varying(255) NOT NULL DEFAULT 'youth'
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_f2578043e491921209f5dadd080"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phoneNumber"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phoneNumber" character varying(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "user_phoneNumber_key" UNIQUE ("phoneNumber")
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "lastName"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "lastName" character varying(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "firstName"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "firstName" character varying(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "updatedAt" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "createdAt" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "employerId" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "status" character varying(50)
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "description" text
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD "title" character varying(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ALTER COLUMN "updatedAt" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ALTER COLUMN "createdAt" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ALTER COLUMN "isRead" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification" DROP COLUMN "message"
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ADD "message" text NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notification" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ADD "title" character varying(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "conversation"
            ALTER COLUMN "createdAt" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "contactEmail"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "companyName"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "applicationDeadline"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "jobType"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."job_jobtype_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "jobCategory"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "experience"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "positions"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "interested"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "qualifications"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "salary"
        `);
    await queryRunner.query(`
            ALTER TABLE "job" DROP COLUMN "location"
        `);
    await queryRunner.query(`
            ALTER TABLE "conversation" DROP COLUMN "messages"
        `);
    await queryRunner.query(`
            ALTER TABLE "conversation"
            ADD "updatedAt" TIMESTAMP DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "conversation"
            ADD "title" character varying(255)
        `);
    await queryRunner.query(`
            DROP TABLE "profile"
        `);
    await queryRunner.query(`
            DROP TABLE "products"
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_job_employer" ON "job" ("employerId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_notification_user" ON "notification" ("userId")
        `);
    await queryRunner.query(`
            ALTER TABLE "job"
            ADD CONSTRAINT "FK_job_user" FOREIGN KEY ("employerId") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "FK_notification_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }
}
