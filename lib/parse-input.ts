import { z } from "zod"

import {
  actionFailure,
  type ActionResult,
} from "@/lib/action-result"

export function fieldErrorsFromZod(
  error: z.ZodError
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form"
    fieldErrors[key] ??= []
    fieldErrors[key].push(issue.message)
  }
  return fieldErrors
}

export function parseInput<T>(
  schema: z.ZodType<T>,
  input: unknown
): { ok: true; data: T } | { ok: false; result: ActionResult<never> } {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      result: actionFailure(
        "VALIDATION_ERROR",
        "Validation failed",
        fieldErrorsFromZod(parsed.error)
      ),
    }
  }
  return { ok: true, data: parsed.data }
}
