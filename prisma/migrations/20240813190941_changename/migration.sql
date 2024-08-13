/*
  Warnings:

  - You are about to drop the column `usersUse_uuid` on the `gas_station_setvariables` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "gas_station_setvariables" DROP CONSTRAINT "gas_station_setvariables_usersUse_uuid_fkey";

-- AlterTable
ALTER TABLE "gas_station_setvariables" DROP COLUMN "usersUse_uuid",
ADD COLUMN     "use_uuid" UUID;

-- AddForeignKey
ALTER TABLE "gas_station_setvariables" ADD CONSTRAINT "gas_station_setvariables_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
