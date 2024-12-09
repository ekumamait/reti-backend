import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchemaSetup1733921827328 implements MigrationInterface {
  name = 'InitialSchemaSetup1733921827328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Drop existing tables to ensure clean setup
            DROP TABLE IF EXISTS "notification" CASCADE;
            DROP TABLE IF EXISTS "product" CASCADE;
            DROP TABLE IF EXISTS "conversation" CASCADE;
            DROP TABLE IF EXISTS "job" CASCADE;
            DROP TABLE IF EXISTS "user" CASCADE;
            DROP TABLE IF EXISTS "products" CASCADE;
            DROP TABLE IF EXISTS "profile" CASCADE;

            -- Create User Table
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "firstName" VARCHAR(255) NOT NULL,
                "lastName" VARCHAR(255) NOT NULL,
                "phoneNumber" VARCHAR(255) UNIQUE NOT NULL,
                "role" VARCHAR(255) NOT NULL DEFAULT 'youth',
                "password" VARCHAR(255) NOT NULL,
                "profileImage" VARCHAR(255),
                "createdAt" TIMESTAMP DEFAULT now()
            );

            -- Create Notification Table
            CREATE TABLE "notification" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR(255) NOT NULL,
                "message" TEXT NOT NULL,
                "isRead" BOOLEAN DEFAULT false,
                "userId" INTEGER,
                "createdAt" TIMESTAMP DEFAULT now(),
                "updatedAt" TIMESTAMP DEFAULT now(),
                CONSTRAINT "FK_notification_user" 
                    FOREIGN KEY ("userId") 
                    REFERENCES "user"("id") 
                    ON DELETE SET NULL
            );

            -- Create Product Table
            CREATE TABLE "product" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "category" VARCHAR(255) DEFAULT 'Uncategorized',
                "userId" INTEGER,
                "createdAt" TIMESTAMP DEFAULT now(),
                "updatedAt" TIMESTAMP DEFAULT now(),
                CONSTRAINT "FK_product_user" 
                    FOREIGN KEY ("userId") 
                    REFERENCES "user"("id") 
                    ON DELETE SET NULL
            );

            -- Create Conversation Table
            CREATE TABLE "conversation" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR(255),
                "createdAt" TIMESTAMP DEFAULT now(),
                "updatedAt" TIMESTAMP DEFAULT now()
            );

            -- Create Job Table
            CREATE TABLE "job" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR(255) NOT NULL,
                "description" TEXT,
                "status" VARCHAR(50),
                "employerId" INTEGER,
                "createdAt" TIMESTAMP DEFAULT now(),
                "updatedAt" TIMESTAMP DEFAULT now(),
                CONSTRAINT "FK_job_user" 
                    FOREIGN KEY ("employerId") 
                    REFERENCES "user"("id") 
                    ON DELETE SET NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS "job";
            DROP TABLE IF EXISTS "conversation";
            DROP TABLE IF EXISTS "product";
            DROP TABLE IF EXISTS "notification";
            DROP TABLE IF EXISTS "user";
        `);
  }
}
