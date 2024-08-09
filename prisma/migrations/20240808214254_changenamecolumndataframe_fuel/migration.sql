/*
  Warnings:

  - Added the required column `datafuel_regional` to the `dataframe_fuel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dataframe_fuel" ADD COLUMN     "datafuel_regional" VARCHAR(255) NOT NULL;
