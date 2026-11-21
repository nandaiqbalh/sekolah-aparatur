-- CreateTable
CREATE TABLE "fee_schedules" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_program_groups" (
    "id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_program_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_lines" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fee_schedules_is_published_sort_order_idx" ON "fee_schedules"("is_published", "sort_order");

-- CreateIndex
CREATE INDEX "fee_schedules_sort_order_idx" ON "fee_schedules"("sort_order");

-- CreateIndex
CREATE INDEX "fee_program_groups_schedule_id_sort_order_idx" ON "fee_program_groups"("schedule_id", "sort_order");

-- CreateIndex
CREATE INDEX "fee_lines_group_id_sort_order_idx" ON "fee_lines"("group_id", "sort_order");

-- AddForeignKey
ALTER TABLE "fee_program_groups" ADD CONSTRAINT "fee_program_groups_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "fee_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_lines" ADD CONSTRAINT "fee_lines_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "fee_program_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
