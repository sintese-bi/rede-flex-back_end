-- CreateTable
CREATE TABLE "basedados" (
    "company_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_emp" INTEGER,
    "company_name" VARCHAR(50),
    "company_date" TIMESTAMP(3),
    "company_week_day" VARCHAR(50),
    "company_fuel" REAL,
    "company_volume" REAL,
    "company_cost" REAL,
    "company_sale" REAL,
    "company_profit" REAL,
    "company_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "basedados_pkey" PRIMARY KEY ("company_uuid")
);
