/*
  Warnings:

  - You are about to drop the column `ibm_info_id` on the `region_setvariables` table. All the data in the column will be lost.
  - You are about to drop the `posto_signal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rd_posto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posto_signal" DROP CONSTRAINT "posto_signal_posto_id_fkey";

-- DropForeignKey
ALTER TABLE "region_setvariables" DROP CONSTRAINT "region_setvariables_ibm_info_id_fkey";

-- AlterTable
ALTER TABLE "region_setvariables" DROP COLUMN "ibm_info_id",
ADD COLUMN     "regions_uuid" UUID;

-- DropTable
DROP TABLE "posto_signal";

-- DropTable
DROP TABLE "rd_posto";

-- CreateTable
CREATE TABLE "regions" (
    "regions_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "regions_name" VARCHAR(50),
    "regions_types" VARCHAR(50),
    "region_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "region_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("regions_uuid")
);

-- AddForeignKey
ALTER TABLE "region_setvariables" ADD CONSTRAINT "region_setvariables_regions_uuid_fkey" FOREIGN KEY ("regions_uuid") REFERENCES "regions"("regions_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
