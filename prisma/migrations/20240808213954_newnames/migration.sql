/*
  Warnings:

  - You are about to drop the column `datafuel_dt_registro` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_litroCombustivel` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_litroOutros` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_litroProduto` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_qtdAbastecimento` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_qtdOutrosProdutos` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_qtdProduto` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_updated` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_vendaCombustivel` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_vendaProduto` on the `dataframe_fuel` table. All the data in the column will be lost.
  - You are about to drop the column `datafuel_vendasOutros` on the `dataframe_fuel` table. All the data in the column will be lost.
  - Added the required column `datafuel_abastecimentos` to the `dataframe_fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datafuel_dayofweek` to the `dataframe_fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datafuel_dt_aval` to the `dataframe_fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datafuel_faturamento` to the `dataframe_fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datafuel_galonagem_litro` to the `dataframe_fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datafuel_posto` to the `dataframe_fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datafuel_topCombustivel` to the `dataframe_fuel` table without a default value. This is not possible if the table is not empty.
  - Made the column `datafuel_custo` on table `dataframe_fuel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `datafuel_lucro` on table `dataframe_fuel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dataframe_fuel" DROP COLUMN "datafuel_dt_registro",
DROP COLUMN "datafuel_litroCombustivel",
DROP COLUMN "datafuel_litroOutros",
DROP COLUMN "datafuel_litroProduto",
DROP COLUMN "datafuel_qtdAbastecimento",
DROP COLUMN "datafuel_qtdOutrosProdutos",
DROP COLUMN "datafuel_qtdProduto",
DROP COLUMN "datafuel_updated",
DROP COLUMN "datafuel_vendaCombustivel",
DROP COLUMN "datafuel_vendaProduto",
DROP COLUMN "datafuel_vendasOutros",
ADD COLUMN     "datafuel_abastecimentos" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "datafuel_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "datafuel_dayofweek" VARCHAR(255) NOT NULL,
ADD COLUMN     "datafuel_dt_aval" DATE NOT NULL,
ADD COLUMN     "datafuel_faturamento" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "datafuel_galonagem_litro" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "datafuel_posto" VARCHAR(255) NOT NULL,
ADD COLUMN     "datafuel_topCombustivel" VARCHAR(255) NOT NULL,
ADD COLUMN     "datafuel_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "datafuel_custo" SET NOT NULL,
ALTER COLUMN "datafuel_lucro" SET NOT NULL;
