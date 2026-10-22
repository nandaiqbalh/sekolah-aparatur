"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm, type FieldPath } from "react-hook-form"

import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema, type ContactInput } from "@/features/contact/schemas/contact"
import { submitMessageAction } from "@/features/pesan/actions/message-actions"

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", contact: "", message: "" },
  })

  async function onSubmit(values: ContactInput) {
    setSubmitError("")
    const result = await submitMessageAction(values)
    if (!result.ok) {
      const fields = new Set<keyof ContactInput>(["name", "contact", "message"])
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0] && fields.has(key as keyof ContactInput)) {
            setError(key as FieldPath<ContactInput>, { message: messages[0] })
          }
        }
      }
      setSubmitError(result.message || "Pesan gagal dikirim.")
      return
    }
    reset()
    setSent(true)
  }

  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Nama lengkap" error={errors.name?.message}>
          <Input className="h-11" placeholder="Nama lengkap" aria-invalid={Boolean(errors.name)} {...register("name")} />
        </Field>
        <Field label="Surel atau nomor telepon" error={errors.contact?.message}>
          <Input
            className="h-11"
            placeholder="nama@surel.com atau 08xxxxxxxxxx"
            aria-invalid={Boolean(errors.contact)}
            {...register("contact")}
          />
        </Field>
        <Field label="Pesan" error={errors.message?.message}>
          <Textarea rows={5} placeholder="Tuliskan pesan Anda" aria-invalid={Boolean(errors.message)} {...register("message")} />
        </Field>
        {submitError ? <p className="text-sm text-red-700">{submitError}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 cursor-pointer rounded-full bg-[var(--sa-navy)] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Kirim pesan
        </button>
      </form>
      <ConfirmDialog
        open={sent}
        onOpenChange={setSent}
        type="success"
        title="Pesan terkirim"
        message="Pesan Anda sudah diterima. Tim LPSDM Aparatur akan menindaklanjutinya."
        confirmLabel="OK"
        onConfirm={() => setSent(false)}
      />
    </>
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
