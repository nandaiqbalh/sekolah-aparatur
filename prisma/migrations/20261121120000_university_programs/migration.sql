-- CreateTable
CREATE TABLE "university_programs" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "study" TEXT NOT NULL,
    "strata" TEXT NOT NULL,
    "concentration" TEXT,
    "for_aparatur_desa" BOOLEAN NOT NULL DEFAULT false,
    "for_aparatur_pemerintah" BOOLEAN NOT NULL DEFAULT false,
    "for_legislator" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "university_programs_partner_id_idx" ON "university_programs"("partner_id");

-- CreateIndex
CREATE INDEX "university_programs_sort_order_idx" ON "university_programs"("sort_order");

-- CreateIndex
CREATE INDEX "university_programs_is_published_idx" ON "university_programs"("is_published");

-- AddForeignKey
ALTER TABLE "university_programs"
  ADD CONSTRAINT "university_programs_partner_id_fkey"
  FOREIGN KEY ("partner_id") REFERENCES "partners"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
