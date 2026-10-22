-- CreateTable
CREATE TABLE "site_contacts" (
    "key" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phones" TEXT[] NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL DEFAULT '',
    "whatsapp_number" TEXT NOT NULL DEFAULT '',
    "socials" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_contacts_pkey" PRIMARY KEY ("key")
);
