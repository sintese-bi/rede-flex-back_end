/*
  Warnings:

  - You are about to drop the `fuel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `set_variables` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "fuel" DROP CONSTRAINT "fuel_use_uuid_fkey";

-- DropForeignKey
ALTER TABLE "set_variables" DROP CONSTRAINT "set_variables_use_uuid_fkey";

-- DropTable
DROP TABLE "fuel";

-- DropTable
DROP TABLE "set_variables";
