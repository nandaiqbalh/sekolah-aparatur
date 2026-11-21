-- CreateTable
CREATE TABLE "program_studies" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "university" TEXT NOT NULL,
    "study" TEXT NOT NULL,
    "strata" TEXT NOT NULL,
    "concentration" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_studies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "program_studies_program_id_sort_order_idx" ON "program_studies"("program_id", "sort_order");

-- AddForeignKey
ALTER TABLE "program_studies" ADD CONSTRAINT "program_studies_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "programs" DROP COLUMN "studies";
