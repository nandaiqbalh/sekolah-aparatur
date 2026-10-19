import { loadLocalEnv } from "../lib/load-env-file"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

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

async function main() {
  await seedStaff(prisma)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
