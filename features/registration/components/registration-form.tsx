"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { programs } from "@/data/programs"
import {
  registrationSchema,
  type RegistrationInput,
} from "@/features/registration/schemas/registration"

export function RegistrationForm({ programSlug }: { programSlug: string }) {
  const [sent, setSent] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      program: programSlug,
      name: "",
      email: "",
      whatsapp: "",
      institution: "",
      position: "",
      address: "",
      schedule: "",
      consent: false,
    },
  })

  function onSubmit(values: RegistrationInput, event?: React.BaseSyntheticEvent) {
    void values
    const form = event?.target
    if (!(form instanceof HTMLFormElement)) return
    const file = form.querySelector<HTMLInputElement>('input[type="file"]')?.files?.[0]
    if (!file) {
      setFileError("Pilih berkas untuk pratinjau unggahan.")
      return
    }
    setFileError(null)
    setSent(true)
  }

  if (sent) {
    return (
      <p className="text-sm leading-6 text-[var(--sa-muted)]" role="status">
        Validasi di peramban berhasil. Pendaftaran belum dikirim dan tidak disimpan.
      </p>
    )
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="Program" error={errors.program?.message}>
        <input type="hidden" {...register("program")} />
        <p className="flex h-11 items-center rounded-lg border border-input bg-[var(--sa-blue-soft)] px-3 text-sm">
          {programs.find((program) => program.slug === programSlug)?.title}
        </p>
      </Field>
      <Field label="Nama lengkap" error={errors.name?.message}>
        <Input className="h-11" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input className="h-11" type="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
      </Field>
      <Field label="Nomor WhatsApp" error={errors.whatsapp?.message}>
        <Input className="h-11" aria-invalid={Boolean(errors.whatsapp)} {...register("whatsapp")} />
      </Field>
      <Field label="Instansi atau lembaga" error={errors.institution?.message}>
        <Input className="h-11" aria-invalid={Boolean(errors.institution)} {...register("institution")} />
      </Field>
      <Field label="Jabatan" error={errors.position?.message}>
        <Input className="h-11" aria-invalid={Boolean(errors.position)} {...register("position")} />
      </Field>
      <Field label="Alamat" error={errors.address?.message}>
        <Textarea rows={3} aria-invalid={Boolean(errors.address)} {...register("address")} />
      </Field>
      <Field label="Pilihan jadwal" error={errors.schedule?.message}>
        <select
          className="h-11 w-full cursor-pointer rounded-lg border border-input bg-white px-3 text-sm"
          aria-invalid={Boolean(errors.schedule)}
          {...register("schedule")}
        >
          <option value="">Pilih semester</option>
          <option value="ganjil">Semester ganjil — kuliah September</option>
          <option value="genap">Semester genap — kuliah Maret</option>
        </select>
      </Field>
      <Field label="Unggah dokumen" error={fileError ?? undefined}>
        <Input className="h-11 cursor-pointer" type="file" name="document" />
      </Field>
      <label className="flex items-start gap-2 text-sm leading-6">
        <input type="checkbox" className="mt-1 cursor-pointer" {...register("consent")} />
        <span>Saya memahami data ini hanya untuk pratinjau dan belum diproses lembaga.</span>
      </label>
      {errors.consent ? <p className="text-sm text-red-700">{errors.consent.message}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-12 cursor-pointer rounded-full bg-[var(--sa-navy)] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Kirim pendaftaran
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
