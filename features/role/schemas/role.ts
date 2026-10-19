import { z } from "zod"

const slugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/, "Slug must be lowercase snake_case")

export const getRolesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
})

export const getRoleByIdSchema = z.object({
  id: z.string().uuid(),
})

export const createRoleSchema = z.object({
  name: z.string().min(1).max(100),
  slug: slugSchema,
  description: z.string().max(500).optional().nullable(),
})

export const updateRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: slugSchema.optional(),
  description: z.string().max(500).optional().nullable(),
})

export const deleteRoleSchema = z.object({
  id: z.string().uuid(),
})

export const assignRolePermissionsSchema = z.object({
  roleId: z.string().uuid(),
  permissionIds: z.array(z.string().uuid()),
})

export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
