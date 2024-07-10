/*
  Warnings:

  - You are about to drop the column `use_margem_al` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margem_al_min` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margem_gc` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margem_gc_min` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margem_total` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margem_total_min` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "use_margem_al",
DROP COLUMN "use_margem_al_min",
DROP COLUMN "use_margem_gc",
DROP COLUMN "use_margem_gc_min",
DROP COLUMN "use_margem_total",
DROP COLUMN "use_margem_total_min",
ADD COLUMN     "use_margin_al" BOOLEAN,
ADD COLUMN     "use_margin_al_flag" VARCHAR(20),
ADD COLUMN     "use_margin_al_min" DOUBLE PRECISION,
ADD COLUMN     "use_margin_gc" BOOLEAN,
ADD COLUMN     "use_margin_gc_flag" VARCHAR(20),
ADD COLUMN     "use_margin_gc_min" DOUBLE PRECISION,
ADD COLUMN     "use_margin_total" BOOLEAN,
ADD COLUMN     "use_margin_total_flag" VARCHAR(20),
ADD COLUMN     "use_margin_total_min" DOUBLE PRECISION,
ADD COLUMN     "use_volume_al_flag" VARCHAR(20),
ADD COLUMN     "use_volume_gc_flag" VARCHAR(20),
ADD COLUMN     "use_volume_total_flag" VARCHAR(20);
