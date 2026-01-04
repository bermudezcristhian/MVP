/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Debt" DROP CONSTRAINT "Debt_userId_fkey";

-- AlterTable
ALTER TABLE "Debt" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "User";
