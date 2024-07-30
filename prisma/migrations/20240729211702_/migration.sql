/*
  Warnings:

  - The primary key for the `ibm_info` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ibm_info" DROP CONSTRAINT "ibm_info_pkey",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "ibm" DROP NOT NULL,
ALTER COLUMN "ibm" SET DATA TYPE TEXT,
ADD CONSTRAINT "ibm_info_pkey" PRIMARY KEY ("id");
