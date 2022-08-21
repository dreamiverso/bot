/*
  Warnings:

  - You are about to drop the `Cron` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Cron";

-- CreateTable
CREATE TABLE "Routine" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);
