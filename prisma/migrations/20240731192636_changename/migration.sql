/*
  Warnings:

  - You are about to drop the column `gas_station` on the `gas_station` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gas_station" DROP COLUMN "gas_station",
ADD COLUMN     "gas_ibm" VARCHAR(255);
