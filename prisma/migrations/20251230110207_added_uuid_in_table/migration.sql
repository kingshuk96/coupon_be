/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `coupons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "coupons_uuid_key" ON "coupons"("uuid");
