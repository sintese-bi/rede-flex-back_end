/*
  Warnings:

  - You are about to drop the column `use_margin_al` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margin_al_flag` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margin_al_min` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margin_gc` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margin_gc_flag` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margin_gc_min` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margin_total` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margin_total_flag` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_margin_total_min` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_al` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_al_flag` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_al_min` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_gc` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_gc_flag` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_gc_min` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_total` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_total_flag` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `use_volume_total_min` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "use_margin_al",
DROP COLUMN "use_margin_al_flag",
DROP COLUMN "use_margin_al_min",
DROP COLUMN "use_margin_gc",
DROP COLUMN "use_margin_gc_flag",
DROP COLUMN "use_margin_gc_min",
DROP COLUMN "use_margin_total",
DROP COLUMN "use_margin_total_flag",
DROP COLUMN "use_margin_total_min",
DROP COLUMN "use_volume_al",
DROP COLUMN "use_volume_al_flag",
DROP COLUMN "use_volume_al_min",
DROP COLUMN "use_volume_gc",
DROP COLUMN "use_volume_gc_flag",
DROP COLUMN "use_volume_gc_min",
DROP COLUMN "use_volume_total",
DROP COLUMN "use_volume_total_flag",
DROP COLUMN "use_volume_total_min";
