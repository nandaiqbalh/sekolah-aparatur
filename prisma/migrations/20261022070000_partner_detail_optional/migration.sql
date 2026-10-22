-- AlterTable
ALTER TABLE "partners" ALTER COLUMN "detail" DROP NOT NULL;

UPDATE "partners" SET "detail" = NULL WHERE btrim("detail") = '';
