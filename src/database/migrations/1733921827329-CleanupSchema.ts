import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanupSchema1733921827329 implements MigrationInterface {
  name = 'CleanupSchema1733921827329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Drop unnecessary tables if they exist
            DROP TABLE IF EXISTS "products" CASCADE;
            DROP TABLE IF EXISTS "profile" CASCADE;
            DROP TABLE IF EXISTS "migrations" CASCADE;

            -- Ensure tables match current entity structure
            ALTER TABLE "notification" 
            ADD COLUMN IF NOT EXISTS "title" VARCHAR(255) NOT NULL,
            ADD COLUMN IF NOT EXISTS "message" TEXT NOT NULL,
            ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT now(),
            ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT now(),
            DROP CONSTRAINT IF EXISTS "FK_notification_user",
            ADD CONSTRAINT "FK_notification_user" 
                FOREIGN KEY ("userId") 
                REFERENCES "user"("id") 
                ON DELETE SET NULL;

            ALTER TABLE "product" 
            ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NOT NULL,
            ADD COLUMN IF NOT EXISTS "category" VARCHAR(255) DEFAULT 'Uncategorized',
            ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT now(),
            ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT now(),
            DROP CONSTRAINT IF EXISTS "FK_product_user",
            ADD CONSTRAINT "FK_product_user" 
                FOREIGN KEY ("userId") 
                REFERENCES "user"("id") 
                ON DELETE SET NULL;

            ALTER TABLE "conversation" 
            ADD COLUMN IF NOT EXISTS "title" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT now(),
            ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT now();

            ALTER TABLE "job" 
            ADD COLUMN IF NOT EXISTS "title" VARCHAR(255) NOT NULL,
            ADD COLUMN IF NOT EXISTS "description" TEXT,
            ADD COLUMN IF NOT EXISTS "status" VARCHAR(50),
            ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT now(),
            ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT now(),
            DROP CONSTRAINT IF EXISTS "FK_job_user",
            ADD CONSTRAINT "FK_job_user" 
                FOREIGN KEY ("employerId") 
                REFERENCES "user"("id") 
                ON DELETE SET NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Provide a way to revert changes if needed
    await queryRunner.query(`
            -- Placeholder for potential rollback
        `);
  }
}
