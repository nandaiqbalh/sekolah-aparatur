"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema, type ContactInput } from "@/features/contact/schemas/contact"

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", contact: "", message: "" },
  })

  function onSubmit(values: ContactInput) {
    void values
    setSent(true)
  }

  if (sent) {
    return (
      <p className="text-sm leading-6 text-[var(--sa-muted)]" role="status">
        Isian lolos validasi di peramban. Pesan belum terkirim karena formulir ini belum terhubung ke backend.
      </p>
    )
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="Nama" error={errors.name?.message}>
        <Input className="h-11" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </Field>
      <Field label="Email atau nomor telepon" error={errors.contact?.message}>
        <Input className="h-11" aria-invalid={Boolean(errors.contact)} {...register("contact")} />
      </Field>
      <Field label="Pesan" error={errors.message?.message}>
        <Textarea rows={5} aria-invalid={Boolean(errors.message)} {...register("message")} />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 cursor-pointer rounded-full bg-[var(--sa-navy)] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Kirim pesan
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  )
}
