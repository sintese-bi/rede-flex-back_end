/*
  Warnings:

  - The `use_whats_app` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "use_whats_app",
ADD COLUMN     "use_whats_app" VARCHAR(255)[];
