-- CreateTable
CREATE TABLE "institution_profiles" (
    "key" TEXT NOT NULL,
    "hero_eyebrow" TEXT NOT NULL,
    "hero_title" TEXT NOT NULL,
    "hero_description" TEXT NOT NULL,
    "lembaga_image" TEXT NOT NULL,
    "lembaga_body" TEXT NOT NULL,
    "latar_belakang_paragraphs" TEXT[] NOT NULL,
    "latar_belakang_points" JSONB NOT NULL,
    "visi" TEXT NOT NULL,
    "misi" TEXT[] NOT NULL,
    "rpl_paragraphs" TEXT[] NOT NULL,
    "legal_basis" TEXT[] NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_profiles_pkey" PRIMARY KEY ("key")
);
