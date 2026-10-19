# Form validation

All application forms use:

| Library | Role |
|---------|------|
| **React Hook Form** | Form state |
| **Zod** | Schema validation |
| **@hookform/resolvers** | `zodResolver` integration |

## Principles

1. Define **all** validation in a Zod schema — no ad-hoc checks in the component.
2. Reuse the **same schema** on the client (`zodResolver`) and server (action `safeParse`).
3. Infer types with `z.infer<typeof Schema>` — do not duplicate interfaces.
4. Show clear field-level errors (schema messages and/or `ActionResult.fieldErrors`).
5. Prefer `Controller` when wiring Base UI / shadcn inputs that do not match native `register` refs.
6. Call server actions with already-shaped values; still **re-validate on the server**.

## Feature layout

```
features/
  contact/
    schemas/
      contact.ts             # Zod schema + inferred type
    repositories/            # optional for contact
    services/
    actions/
      contact-actions.ts     # safeParse → service → ActionResult
    components/
      contact-form.tsx       # RHF + zodResolver + action
```

## Schema

```ts
import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.email("Enter a valid email"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
})

export type ContactFormValues = z.infer<typeof contactSchema>
```

Use Zod 4 APIs available in this repo (e.g. `z.email()`). Keep user-facing messages clear; later you can source them from i18n dictionaries if needed.

## Client form

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { contactSchema, type ContactFormValues } from "../schemas/contact"
import { createContactAction } from "../actions/contact-actions"

const {
  control,
  handleSubmit,
  setError,
  formState: { errors },
} = useForm<ContactFormValues>({
  resolver: zodResolver(contactSchema),
  defaultValues: { name: "", email: "", message: "" },
})

async function onSubmit(values: ContactFormValues) {
  const result = await createContactAction(values)
  if (!result.ok) {
    // map fieldErrors → setError("field", { message })
    // or setError("root", { message: result.message })
    return
  }
  // success: reset / toast / router.refresh()
}
```

Use `noValidate` on `<form>` so the browser does not fight Zod messages.

## Server action

```ts
"use server"

const parsed = contactSchema.safeParse(input)
if (!parsed.success) {
  // map parsed.error.issues → fieldErrors
  return actionFailure("VALIDATION_ERROR", "Validation failed", fieldErrors)
}

const data = await contactService.create(parsed.data)
return actionSuccess(data, "Message sent")
```

Never trust client-only validation. Always return [`ActionResult`](./architecture.md#actionresult-contract) with `data`, `error`, and `message`.

## Reference implementation

| Piece | Path |
|-------|------|
| Schema | `features/auth/schemas/auth.ts` |
| Action | `features/auth/actions/auth-actions.ts` |
| Login form | `features/auth/components/login-form.tsx` |
| Profile form | `features/auth/components/profile-form.tsx` |

Open `/admin/login` and `/admin/profile` to try RHF + Zod against server actions.

## Anti-patterns

- Manual `if (!title)` validation in the component
- Separate client/server schemas that drift apart
- Hand-written form types that duplicate Zod
- Skipping server `safeParse` because “the form already validated”
- Returning unstructured `{ success: false, msg: "..." }` instead of `ActionResult`

## Related

- [architecture.md](./architecture.md) · [ai-rules.md](./ai-rules.md) · [Docs index](../README.md)
