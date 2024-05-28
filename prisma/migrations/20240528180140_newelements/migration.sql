-- CreateTable
CREATE TABLE "users" (
    "use_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "use_name" VARCHAR(100),
    "use_email" VARCHAR(50),
    "use_password" VARCHAR(255),
    "use_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "use_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "use_date_expire" TIMESTAMP(3),
    "use_token" VARCHAR(50),
    "use_whats_app" VARCHAR(20),
    "use_margem_gc" BOOLEAN,
    "use_margem_al" BOOLEAN,
    "use_margem_total" BOOLEAN,
    "use_volume_gc" BOOLEAN,
    "use_volume_al" BOOLEAN,
    "use_volume_total" BOOLEAN,
    "use_margem_gc_min" DOUBLE PRECISION,
    "use_margem_al_min" DOUBLE PRECISION,
    "use_margem_total_min" DOUBLE PRECISION,
    "use_volume_gc_min" DOUBLE PRECISION,
    "use_volume_al_min" DOUBLE PRECISION,
    "use_volume_total_min" DOUBLE PRECISION,

    CONSTRAINT "users_pkey" PRIMARY KEY ("use_uuid")
);

-- CreateTable
CREATE TABLE "posto_signal" (
    "table_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "posto_id" UUID,
    "vol_sold" REAL,
    "vol_rate" REAL,
    "vol_alert" VARCHAR(255),
    "invoicing" REAL,
    "invoice_rate" REAL,
    "invoice_alert" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posto_signal_pkey" PRIMARY KEY ("table_id")
);

-- CreateTable
CREATE TABLE "rd_posto" (
    "posto_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "posto_name" VARCHAR(255),

    CONSTRAINT "rd_posto_pkey" PRIMARY KEY ("posto_uuid")
);

-- CreateIndex
CREATE INDEX "posto_signal_posto_id_idx" ON "posto_signal"("posto_id");

-- AddForeignKey
ALTER TABLE "posto_signal" ADD CONSTRAINT "posto_signal_posto_id_fkey" FOREIGN KEY ("posto_id") REFERENCES "rd_posto"("posto_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
