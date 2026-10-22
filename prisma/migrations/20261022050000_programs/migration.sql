-- CreateTable
CREATE TABLE "programs" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_alt" TEXT NOT NULL,
    "intro_paragraphs" TEXT[] NOT NULL,
    "highlights" JSONB NOT NULL,
    "studies" JSONB NOT NULL,
    "registration_periods" JSONB NOT NULL,
    "campus" JSONB NOT NULL,
    "requirement_groups" JSONB NOT NULL,
    "documents" JSONB NOT NULL,
    "mitra_ids" TEXT[] NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

-- CreateIndex
CREATE INDEX "programs_is_published_sort_order_idx" ON "programs"("is_published", "sort_order");

-- CreateIndex
CREATE INDEX "programs_sort_order_idx" ON "programs"("sort_order");
