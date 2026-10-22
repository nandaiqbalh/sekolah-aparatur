import { loadLocalEnv } from "../lib/load-env-file"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

import { galleryAlbums } from "../data/gallery"
import { homeContent } from "../data/home"
import { institutionProfileSeed } from "../data/profile"
import { newsArticles } from "../data/news"
import { getProgram } from "../data/programs"
import { sekolahClasses } from "../data/sekolah-classes"
import { siteContact } from "../lib/site-contact"
import { seedRbac } from "./seed-rbac"

loadLocalEnv()

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for seed")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
})

async function ensureStaffUser(
  client: PrismaClient,
  input: {
    email: string
    username: string
    password: string
    name: string
    roleSlug: string
  },
) {
  const role = await client.role.findUnique({ where: { slug: input.roleSlug } })
  if (!role) {
    console.warn(
      `Role missing (${input.roleSlug}) — skipping user seed: ${input.email}`,
    )
    return
  }

  const username = input.username.toLowerCase()
  const byEmail = await client.user.findUnique({
    where: { email: input.email },
    include: { userRoles: true },
  })
  const byUsername = await client.user.findUnique({
    where: { username },
    include: { userRoles: true },
  })

  const existing = byEmail ?? byUsername

  if (existing) {
    const data: { name: string; email?: string; username?: string } = {
      name: input.name,
    }

    if (existing.email !== input.email) {
      const emailTaken = await client.user.findUnique({
        where: { email: input.email },
      })
      if (!emailTaken) data.email = input.email
    }

    if (existing.username !== username) {
      const usernameTaken = await client.user.findUnique({ where: { username } })
      if (!usernameTaken) data.username = username
    }

    await client.user.update({
      where: { id: existing.id },
      data,
    })

    const hasRole = existing.userRoles.some((ur) => ur.roleId === role.id)
    if (!hasRole) {
      await client.userRole.create({
        data: { userId: existing.id, roleId: role.id },
      })
      console.log(
        `Assigned ${input.roleSlug} to existing user: ${existing.email}`,
      )
    } else {
      console.log(
        `Staff user already exists: ${existing.email} (${input.roleSlug})`,
      )
    }
    return
  }

  const hashedPassword = await bcrypt.hash(input.password, 12)
  await client.user.create({
    data: {
      name: input.name,
      username,
      email: input.email,
      password: hashedPassword,
      userRoles: { create: { roleId: role.id } },
    },
  })
  console.log(`Staff user created: ${input.email} / ${username} (${input.roleSlug})`)
}

async function seedStaff(client: PrismaClient) {
  await seedRbac(client)

  const superEmail = process.env.SEED_SUPER_ADMIN_EMAIL
  const superPassword = process.env.SEED_SUPER_ADMIN_PASSWORD
  const superName = process.env.SEED_SUPER_ADMIN_NAME || "Super Admin"
  const superUsername = process.env.SEED_SUPER_ADMIN_USERNAME || "superadmin"

  if (!superEmail || !superPassword) {
    console.warn(
      "SEED_SUPER_ADMIN_EMAIL or SEED_SUPER_ADMIN_PASSWORD not set — skipping super admin seed",
    )
  } else {
    await ensureStaffUser(client, {
      email: superEmail,
      username: superUsername,
      password: superPassword,
      name: superName,
      roleSlug: "super_admin",
    })
  }
}

async function seedNewsArticles(client: PrismaClient) {
  for (const article of newsArticles) {
    const existing = await client.newsArticle.findUnique({
      where: { slug: article.slug },
    })
    if (existing) continue

    await client.newsArticle.create({
      data: {
        slug: article.slug,
        title: article.title,
        category: article.category,
        publishedAt: new Date(`${article.publishedAt}T00:00:00.000Z`),
        summary: article.summary,
        thumbnail: article.thumbnail,
        gallery: article.gallery,
        bodyHtml: article.bodyHtml,
        isPublished: true,
      },
    })
    console.log(`News article seeded: ${article.slug}`)
  }
}

async function seedGalleryAlbums(client: PrismaClient) {
  for (const album of galleryAlbums) {
    const existing = await client.galleryAlbum.findUnique({
      where: { slug: album.slug },
    })
    if (existing) continue

    await client.galleryAlbum.create({
      data: {
        slug: album.slug,
        title: album.title,
        category: album.category,
        dateLabel: album.date,
        summary: album.summary,
        images: album.images,
        isPublished: true,
      },
    })
    console.log(`Gallery album seeded: ${album.slug}`)
  }
}

async function seedInstitutionProfile(client: PrismaClient) {
  const existing = await client.institutionProfile.findUnique({
    where: { key: institutionProfileSeed.key },
  })
  if (existing) return

  await client.institutionProfile.create({
    data: institutionProfileSeed,
  })
  console.log(`Institution profile seeded: ${institutionProfileSeed.key}`)
}

async function seedPartners(client: PrismaClient) {
  const rows = [
    ...homeContent.partners.map((item, index) => ({
      kind: "university",
      name: item.name,
      detail: item.program,
      logo: item.logo,
      sortOrder: index,
    })),
    ...homeContent.facilitators.map((item, index) => ({
      kind: "facilitator",
      name: item.name,
      detail: item.fullName,
      logo: item.logo,
      sortOrder: index,
    })),
  ]

  for (const row of rows) {
    const existing = await client.partner.findUnique({
      where: { kind_name: { kind: row.kind, name: row.name } },
    })
    if (existing) continue

    await client.partner.create({
      data: { ...row, isPublished: true },
    })
    console.log(`Partner seeded: ${row.kind} ${row.name}`)
  }
}

async function seedPrograms(client: PrismaClient) {
  const facilitators = await client.partner.findMany({ where: { kind: "facilitator" } })

  for (const [index, kelas] of sekolahClasses.entries()) {
    const existing = await client.program.findUnique({ where: { slug: kelas.slug } })
    if (existing) continue

    const program = getProgram(kelas.programSlug)
    if (!program) continue

    const intro = program.sections.find((section) => section.kind === "paragraphs" && section.title === "Pengantar")
    const mitraIds = program.mitra
      .map((name) => facilitators.find((item) => item.name === name)?.id)
      .filter((id): id is string => Boolean(id))

    await client.program.create({
      data: {
        slug: kelas.slug,
        title: kelas.title,
        summary: kelas.summary,
        image: kelas.image,
        imageAlt: kelas.imageAlt,
        introParagraphs: intro?.kind === "paragraphs" ? intro.paragraphs : [],
        highlights: program.highlights,
        studies: program.studies,
        registrationPeriods: program.registrationPeriods,
        campus: program.campus,
        requirementGroups: kelas.requirementGroups,
        documents: kelas.documents.map((document) => ({
          name: document.name,
          format: document.format,
          size: document.size ?? "",
          description: document.description,
          href: document.href ?? "",
        })),
        mitraIds,
        sortOrder: index,
        isPublished: true,
      },
    })
    console.log(`Program seeded: ${kelas.slug}`)
  }
}

async function seedSiteContact(client: PrismaClient) {
  const existing = await client.siteContact.findUnique({ where: { key: "kontak" } })
  if (existing) return

  await client.siteContact.create({
    data: {
      key: "kontak",
      address: siteContact.address,
      phones: siteContact.phones,
      email: siteContact.email,
      website: siteContact.website,
      whatsappNumber: siteContact.whatsappNumber,
      socials: [
        { platform: "instagram", url: siteContact.instagram },
        { platform: "facebook", url: siteContact.facebook },
      ],
    },
  })
  console.log("Site contact seeded: kontak")
}

async function main() {
  await seedStaff(prisma)
  await seedNewsArticles(prisma)
  await seedGalleryAlbums(prisma)
  await seedInstitutionProfile(prisma)
  await seedPartners(prisma)
  await seedPrograms(prisma)
  await seedSiteContact(prisma)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
