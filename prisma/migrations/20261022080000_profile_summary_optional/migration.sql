-- AlterTable
ALTER TABLE "institution_profiles" ALTER COLUMN "hero_description" DROP NOT NULL;

UPDATE "institution_profiles" SET "hero_description" = NULL WHERE btrim("hero_description") = '';
