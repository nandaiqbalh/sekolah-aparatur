-- Ensure university partners used by Data AY exist (idempotent).
INSERT INTO "partners" ("id", "kind", "name", "detail", "logo", "sort_order", "is_published", "created_at", "updated_at")
SELECT gen_random_uuid(), 'university', v.name, v.detail, v.logo, v.sort_order, true, NOW(), NOW()
FROM (VALUES
  ('Universitas Nasional', 'Kelas Legislator', '/brand/universitas-nasional.png', 1),
  ('Universitas Muhammadiyah Tapanuli Selatan', 'Kelas Aparatur Pemerintah Daerah dan Kelas Aparatur Desa', '/brand/um-tapsel.jpeg', 0),
  ('Universitas Ekasakti Padang', '', '/brand/universitas-nasional.png', 2),
  ('Universitas Nurdin Hamzah Jambi', '', '/brand/universitas-nasional.png', 3),
  ('Universitas Lancang Kuning Pekanbaru', '', '/brand/universitas-nasional.png', 4),
  ('Universitas Muara Bungo Jambi', '', '/brand/universitas-nasional.png', 5)
) AS v(name, detail, logo, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM "partners" p WHERE p.kind = 'university' AND p.name = v.name
);

-- AlterTable
ALTER TABLE "program_studies" ADD COLUMN "partner_id" UUID;

-- Map legacy free-text university labels to partner rows.
UPDATE "program_studies" AS ps
SET "partner_id" = p.id
FROM "partners" AS p
WHERE p.kind = 'university'
  AND (
    (ps.university IN ('Univ. Nasional', 'Universitas Nasional') AND p.name = 'Universitas Nasional')
    OR (ps.university IN ('Univ Ekasakti Padang', 'Universitas Ekasakti Padang') AND p.name = 'Universitas Ekasakti Padang')
    OR (ps.university IN ('Univ Nurdin Hamzah Jambi', 'Universitas Nurdin Hamzah Jambi') AND p.name = 'Universitas Nurdin Hamzah Jambi')
    OR (ps.university IN ('Univ Lancang Kuning Pekanbaru', 'Universitas Lancang Kuning Pekanbaru') AND p.name = 'Universitas Lancang Kuning Pekanbaru')
    OR (ps.university IN ('Universitas Muhammadiyah Tapsel', 'Universitas Muhammadiyah Tapanuli Selatan') AND p.name = 'Universitas Muhammadiyah Tapanuli Selatan')
    OR (ps.university = 'Universitas Muara Bungo Jambi' AND p.name = 'Universitas Muara Bungo Jambi')
  );

-- Drop rows that could not be mapped (should be none after partner upsert).
DELETE FROM "program_studies" WHERE "partner_id" IS NULL;

ALTER TABLE "program_studies" ALTER COLUMN "partner_id" SET NOT NULL;
ALTER TABLE "program_studies" DROP COLUMN "university";

CREATE INDEX "program_studies_partner_id_idx" ON "program_studies"("partner_id");

ALTER TABLE "program_studies"
  ADD CONSTRAINT "program_studies_partner_id_fkey"
  FOREIGN KEY ("partner_id") REFERENCES "partners"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Align UNAS concentrations with Data AY source content.
UPDATE "program_studies" AS ps
SET "concentration" = v.concentration
FROM "partners" AS p,
  (VALUES
    ('Ilmu Politik', 'S2', 'Politik dan Kebijakan Publik'),
    ('Ilmu Politik', 'S3', 'Politik Indonesia'),
    ('Administrasi Publik', 'S3', 'Teknologi Administrasi/Pelayanan Publik'),
    ('Ilmu Hukum', 'S2', 'Tata Negara'),
    ('Ilmu Hukum', 'S3', 'Ilmu Hukum')
  ) AS v(study, strata, concentration)
WHERE ps.partner_id = p.id
  AND p.kind = 'university'
  AND p.name = 'Universitas Nasional'
  AND ps.study = v.study
  AND ps.strata = v.strata;
