-- CreateTable
CREATE TABLE "ibm_info" (
    "ibm" UUID NOT NULL,
    "nomefantasia" VARCHAR(255),
    "cnpj" VARCHAR(255),
    "razaosocial" VARCHAR(255),
    "cep" VARCHAR(255),
    "lat" DOUBLE PRECISION,
    "long" DOUBLE PRECISION,

    CONSTRAINT "ibm_info_pkey" PRIMARY KEY ("ibm")
);
