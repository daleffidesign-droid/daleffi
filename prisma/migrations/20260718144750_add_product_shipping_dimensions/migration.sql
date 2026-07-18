/*
  Warnings:

  - Added the required column `heightCm` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lengthCm` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightKg` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `widthCm` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "heightCm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lengthCm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weightKg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "widthCm" DOUBLE PRECISION NOT NULL;
