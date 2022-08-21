/*
  Warnings:

  - The primary key for the `Routine` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Routine_pkey" PRIMARY KEY ("id");
