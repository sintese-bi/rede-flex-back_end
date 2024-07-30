/*
  Warnings:

  - You are about to alter the column `ibm` on the `ibm_info` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "ibm_info" ALTER COLUMN "ibm" SET DATA TYPE VARCHAR(255);
