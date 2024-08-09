-- AlterTable
ALTER TABLE "dataframe_fuel" ALTER COLUMN "datafuel_custo" DROP NOT NULL,
ALTER COLUMN "datafuel_lucro" DROP NOT NULL,
ALTER COLUMN "datafuel_abastecimentos" DROP NOT NULL,
ALTER COLUMN "datafuel_dayofweek" DROP NOT NULL,
ALTER COLUMN "datafuel_faturamento" DROP NOT NULL,
ALTER COLUMN "datafuel_galonagem_litro" DROP NOT NULL,
ALTER COLUMN "datafuel_posto" DROP NOT NULL,
ALTER COLUMN "datafuel_topCombustivel" DROP NOT NULL,
ALTER COLUMN "datafuel_regional" DROP NOT NULL;
