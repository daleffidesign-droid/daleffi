-- AlterTable
ALTER TABLE "user" ADD COLUMN     "banExpiresAt" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT;
