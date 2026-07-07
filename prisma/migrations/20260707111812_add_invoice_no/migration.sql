/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNo]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - The required column `invoiceNo` was added to the `Invoice` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable: add as nullable first
ALTER TABLE "Invoice" ADD COLUMN "invoiceNo" TEXT;

-- Backfill existing rows with a generated value
UPDATE "Invoice" SET "invoiceNo" = 'INV-' || extract(year from now()) || '-' || substr(md5(random()::text || id), 1, 4) WHERE "invoiceNo" IS NULL;

-- Now make it required and unique
ALTER TABLE "Invoice" ALTER COLUMN "invoiceNo" SET NOT NULL;
CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON "Invoice"("invoiceNo");
