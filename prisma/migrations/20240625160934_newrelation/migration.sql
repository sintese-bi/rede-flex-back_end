-- CreateTable
CREATE TABLE "fuel" (
    "fuel_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fuel_regular_gasoline" REAL,
    "fuel_alcohol" REAL,
    "use_uuid" UUID,

    CONSTRAINT "fuel_pkey" PRIMARY KEY ("fuel_uuid")
);

-- CreateTable
CREATE TABLE "set_variables" (
    "set_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "set_regular_gasoline" REAL,
    "set_alcohol" REAL,
    "use_uuid" UUID,

    CONSTRAINT "set_variables_pkey" PRIMARY KEY ("set_uuid")
);

-- AddForeignKey
ALTER TABLE "fuel" ADD CONSTRAINT "fuel_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "set_variables" ADD CONSTRAINT "set_variables_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
