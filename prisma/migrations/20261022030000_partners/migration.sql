-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_kind_name_key" ON "partners"("kind", "name");

-- CreateIndex
CREATE INDEX "partners_kind_sort_order_idx" ON "partners"("kind", "sort_order");

-- CreateIndex
CREATE INDEX "partners_is_published_idx" ON "partners"("is_published");
