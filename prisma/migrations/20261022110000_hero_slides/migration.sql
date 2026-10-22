-- CreateTable
CREATE TABLE "hero_slides" (
    "id" UUID NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hero_slides_is_published_sort_order_idx" ON "hero_slides"("is_published", "sort_order");

-- CreateIndex
CREATE INDEX "hero_slides_sort_order_idx" ON "hero_slides"("sort_order");

-- Seed the two hero images that used to be hardcoded on the landing page
INSERT INTO "hero_slides" ("id", "image", "alt", "sort_order", "is_published", "created_at", "updated_at")
VALUES
    ('3f1c2a54-9d6e-4f21-8a7b-1c0d2e3f4a51', '/profile/hero-001.jpg', 'Kegiatan Sekolah Aparatur', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('3f1c2a54-9d6e-4f21-8a7b-1c0d2e3f4a52', '/profile/hero-002.jpg', 'Kegiatan Sekolah Aparatur', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
