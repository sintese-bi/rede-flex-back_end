-- DropForeignKey
ALTER TABLE "gas_station_setvariables" DROP CONSTRAINT "gas_station_setvariables_ibm_info_id_fkey";

-- DropForeignKey
ALTER TABLE "region_setvariables" DROP CONSTRAINT "region_setvariables_ibm_info_id_fkey";

-- AlterTable
ALTER TABLE "gas_station_setvariables" ALTER COLUMN "ibm_info_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "region_setvariables" ALTER COLUMN "ibm_info_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "gas_station_setvariables" ADD CONSTRAINT "gas_station_setvariables_ibm_info_id_fkey" FOREIGN KEY ("ibm_info_id") REFERENCES "ibm_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "region_setvariables" ADD CONSTRAINT "region_setvariables_ibm_info_id_fkey" FOREIGN KEY ("ibm_info_id") REFERENCES "ibm_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
