-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date_label" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "images" TEXT[] NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_albums_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_albums_slug_key" ON "gallery_albums"("slug");

-- CreateIndex
CREATE INDEX "gallery_albums_is_published_idx" ON "gallery_albums"("is_published");

-- CreateIndex
CREATE INDEX "gallery_albums_created_at_idx" ON "gallery_albums"("created_at");
