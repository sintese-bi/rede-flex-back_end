-- CreateTable
CREATE TABLE "dataframe_fuel" (
    "datafuel_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "datafuel_qtdAbastecimento" DOUBLE PRECISION,
    "datafuel_vendaCombustivel" DOUBLE PRECISION,
    "datafuel_litroCombustivel" DOUBLE PRECISION,
    "datafuel_qtdProduto" DOUBLE PRECISION,
    "datafuel_vendaProduto" DOUBLE PRECISION,
    "datafuel_litroProduto" DOUBLE PRECISION,
    "datafuel_qtdOutrosProdutos" DOUBLE PRECISION,
    "datafuel_vendasOutros" DOUBLE PRECISION,
    "datafuel_litroOutros" DOUBLE PRECISION,
    "datafuel_custo" DOUBLE PRECISION,
    "datafuel_lucro" DOUBLE PRECISION,
    "datafuel_dt_registro" VARCHAR(255),
    "datafuel_updated" VARCHAR(255),

    CONSTRAINT "dataframe_fuel_pkey" PRIMARY KEY ("datafuel_uuid")
);

-- CreateTable
CREATE TABLE "dataframe_product" (
    "dataproduct_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dataproduct_posto" VARCHAR(255),
    "dataproduct_venda_produto" VARCHAR(255),
    "dataproduct_valor_venda" DOUBLE PRECISION,
    "dataproduct_qtd_produto_vendido" DOUBLE PRECISION,
    "dataproduct_dt_registro" VARCHAR(255),
    "dataproduct_updated" VARCHAR(255),

    CONSTRAINT "dataframe_product_pkey" PRIMARY KEY ("dataproduct_uuid")
);
