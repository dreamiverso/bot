-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "idDiscord" TEXT NOT NULL,
    "idPSN" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "autoaura" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_idDiscord_key" ON "User"("idDiscord");

-- CreateIndex
CREATE UNIQUE INDEX "User_idPSN_key" ON "User"("idPSN");
