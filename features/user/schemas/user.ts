import { z } from "zod"

import { usernameSchema } from "@/features/auth/schemas/auth"

export const getUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  roleId: z.string().uuid().optional(),
})

export const getUserByIdSchema = z.object({
  id: z.string().uuid(),
})

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: usernameSchema,
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleIds: z.array(z.string().uuid()).length(1, "Exactly one role is required"),
  isActive: z.boolean().default(true),
})

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  username: usernameSchema,
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  roleIds: z
    .array(z.string().uuid())
    .length(1, "Exactly one role is required")
    .optional(),
  isActive: z.boolean().optional(),
})

export const toggleUserActiveSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
})

export const deleteUserSchema = z.object({
  id: z.string().uuid(),
})

export type GetUsersInput = z.infer<typeof getUsersSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
