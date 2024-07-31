-- CreateTable
CREATE TABLE "gas_station" (
    "gas_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gas_station" VARCHAR(255),
    "gas_fuel_type" VARCHAR(255),
    "gas_value" DOUBLE PRECISION,
    "gas_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gas_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gas_station_pkey" PRIMARY KEY ("gas_uuid")
);
