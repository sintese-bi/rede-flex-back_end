-- CreateTable
CREATE TABLE "gas_station_setvariables" (
    "gas_station_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gas_station_marginGC" DOUBLE PRECISION,
    "gas_station_marginAL" DOUBLE PRECISION,
    "gas_station_marginTotal" DOUBLE PRECISION,
    "gas_station_volumeGC" DOUBLE PRECISION,
    "gas_station_volumeAL" DOUBLE PRECISION,
    "gas_station_volumeTotal" DOUBLE PRECISION,
    "gas_station_type_marginGC" BOOLEAN,
    "gas_station_type_marginAL" BOOLEAN,
    "gas_station_type_marginTotal" BOOLEAN,
    "gas_station_type_volumeGC" BOOLEAN,
    "gas_station_type_volumeAL" BOOLEAN,
    "gas_station_type_volumeTotal" BOOLEAN,
    "gas_station_whats_app" VARCHAR(255)[],
    "gas_station_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gas_station_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersUse_uuid" UUID,
    "ibm_info_id" UUID NOT NULL,

    CONSTRAINT "gas_station_setvariables_pkey" PRIMARY KEY ("gas_station_uuid")
);

-- CreateTable
CREATE TABLE "region_setvariables" (
    "region_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "region_marginGC" DOUBLE PRECISION,
    "region_marginAL" DOUBLE PRECISION,
    "region_marginTotal" DOUBLE PRECISION,
    "region_volumeGC" DOUBLE PRECISION,
    "region_volumeAL" DOUBLE PRECISION,
    "region_volumeTotal" DOUBLE PRECISION,
    "region_type_marginGC" BOOLEAN,
    "region_type_marginAL" BOOLEAN,
    "region_type_marginTotal" BOOLEAN,
    "region_type_volumeGC" BOOLEAN,
    "region_type_volumeAL" BOOLEAN,
    "region_type_volumeTotal" BOOLEAN,
    "region_whats_app" VARCHAR(255)[],
    "region_station_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "region_station_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "use_uuid" UUID NOT NULL,
    "ibm_info_id" UUID NOT NULL,

    CONSTRAINT "region_setvariables_pkey" PRIMARY KEY ("region_uuid")
);

-- AddForeignKey
ALTER TABLE "gas_station_setvariables" ADD CONSTRAINT "gas_station_setvariables_usersUse_uuid_fkey" FOREIGN KEY ("usersUse_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_station_setvariables" ADD CONSTRAINT "gas_station_setvariables_ibm_info_id_fkey" FOREIGN KEY ("ibm_info_id") REFERENCES "ibm_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "region_setvariables" ADD CONSTRAINT "region_setvariables_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "region_setvariables" ADD CONSTRAINT "region_setvariables_ibm_info_id_fkey" FOREIGN KEY ("ibm_info_id") REFERENCES "ibm_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
