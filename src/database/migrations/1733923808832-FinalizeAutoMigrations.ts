// src/database/migrations/1733923808832-FinalizeAutoMigrations.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinalizeAutoMigrations1733923808832 implements MigrationInterface {
  name = 'FinalizeAutoMigrations1733923808832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Add indexes for foreign key columns to improve query performance
            CREATE INDEX IF NOT EXISTS "IDX_notification_user" ON "notification"("userId");
            CREATE INDEX IF NOT EXISTS "IDX_product_user" ON "product"("userId");
            CREATE INDEX IF NOT EXISTS "IDX_job_employer" ON "job"("employerId");

            -- Ensure consistent ON DELETE behavior for foreign key constraints
            ALTER TABLE "notification" 
            DROP CONSTRAINT IF EXISTS "FK_notification_user",
            ADD CONSTRAINT "FK_notification_user" 
                FOREIGN KEY ("userId") 
                REFERENCES "user"("id") 
                ON DELETE SET NULL;

            ALTER TABLE "product" 
            DROP CONSTRAINT IF EXISTS "FK_product_user",
            ADD CONSTRAINT "FK_product_user" 
                FOREIGN KEY ("userId") 
                REFERENCES "user"("id") 
                ON DELETE SET NULL;

            ALTER TABLE "job" 
            DROP CONSTRAINT IF EXISTS "FK_job_user",
            ADD CONSTRAINT "FK_job_user" 
                FOREIGN KEY ("employerId") 
                REFERENCES "user"("id") 
                ON DELETE SET NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Remove indexes
            DROP INDEX IF EXISTS "IDX_notification_user";
            DROP INDEX IF EXISTS "IDX_product_user";
            DROP INDEX IF EXISTS "IDX_job_employer";
        `);
  }
}
