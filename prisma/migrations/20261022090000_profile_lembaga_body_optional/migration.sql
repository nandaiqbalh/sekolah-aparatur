-- AlterTable
ALTER TABLE "institution_profiles" ALTER COLUMN "lembaga_body" DROP NOT NULL;

UPDATE "institution_profiles" SET "lembaga_body" = NULL WHERE btrim("lembaga_body") = '';
