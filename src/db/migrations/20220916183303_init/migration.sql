-- CreateTable
CREATE TABLE "AutoauraIntent" (
    "id" SERIAL NOT NULL,
    "idDiscord" TEXT NOT NULL,
    "idPSN" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoauraIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutoauraIntent_idDiscord_key" ON "AutoauraIntent"("idDiscord");

-- CreateIndex
CREATE UNIQUE INDEX "AutoauraIntent_idPSN_key" ON "AutoauraIntent"("idPSN");
