-- DropForeignKey
ALTER TABLE "region_setvariables" DROP CONSTRAINT "region_setvariables_use_uuid_fkey";

-- AlterTable
ALTER TABLE "region_setvariables" ALTER COLUMN "use_uuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "region_setvariables" ADD CONSTRAINT "region_setvariables_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
