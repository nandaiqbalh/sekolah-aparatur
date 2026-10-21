"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { sekolahClasses } from "@/data/sekolah-classes"
import {
  registrationSchema,
  type RegistrationInput,
} from "@/features/registration/schemas/registration"

export function RegistrationForm({ programSlug }: { programSlug: string }) {
  const [sent, setSent] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      program: sekolahClasses.some((item) => item.slug === programSlug) ? programSlug : "",
      name: "",
      email: "",
      whatsapp: "",
      institution: "",
      position: "",
      address: "",
      consent: false,
    },
  })

  function onSubmit(values: RegistrationInput) {
    void values
    setSent(true)
  }

  if (sent) {
    return (
      <p className="text-sm leading-6 text-[var(--sa-muted)]" role="status">
        Data pendaftaran akan disimpan. Tim Sekolah Aparatur akan menghubungi Anda.
      </p>
    )
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="Program" error={errors.program?.message}>
        <Controller
          name="program"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
            >
              <SelectTrigger
                className="h-11 w-full bg-white"
                aria-invalid={Boolean(errors.program)}
                onBlur={field.onBlur}
              >
                <SelectValue placeholder="Pilih program">
                  {(value: string | null) =>
                    sekolahClasses.find((item) => item.slug === value)?.title ?? "Pilih program"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sekolahClasses.map((item) => (
                  <SelectItem key={item.slug} value={item.slug}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama lengkap" error={errors.name?.message}>
          <Input className="h-11 bg-white" placeholder="Nama sesuai identitas" aria-invalid={Boolean(errors.name)} {...register("name")} />
        </Field>
        <Field label="Surel" error={errors.email?.message}>
          <Input className="h-11 bg-white" type="email" placeholder="nama@surel.com" aria-invalid={Boolean(errors.email)} {...register("email")} />
        </Field>
        <Field label="Nomor WhatsApp" error={errors.whatsapp?.message}>
          <Input className="h-11 bg-white" placeholder="08xxxxxxxxxx" aria-invalid={Boolean(errors.whatsapp)} {...register("whatsapp")} />
        </Field>
        <Field label="Instansi atau lembaga" error={errors.institution?.message}>
          <Input className="h-11 bg-white" placeholder="Nama instansi atau lembaga" aria-invalid={Boolean(errors.institution)} {...register("institution")} />
        </Field>
        <Field label="Jabatan" error={errors.position?.message}>
          <Input className="h-11 bg-white" placeholder="Jabatan saat ini" aria-invalid={Boolean(errors.position)} {...register("position")} />
        </Field>
      </div>
      <Field label="Alamat" error={errors.address?.message}>
        <Textarea className="bg-white" rows={3} placeholder="Alamat lengkap" aria-invalid={Boolean(errors.address)} {...register("address")} />
      </Field>
      <Controller
        name="consent"
        control={control}
        render={({ field }) => (
          <div className="flex items-start gap-2">
            <Checkbox
              id="registration-consent"
              className="mt-1"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
              onBlur={field.onBlur}
              aria-invalid={Boolean(errors.consent)}
            />
            <Label htmlFor="registration-consent" className="cursor-pointer items-start font-normal leading-6">
              Saya memahami bahwa data yang saya isi akan disimpan dan saya akan dihubungi oleh tim Sekolah Aparatur.
            </Label>
          </div>
        )}
      />
      {errors.consent ? <p className="text-sm text-red-700">{errors.consent.message}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-12 cursor-pointer rounded-full bg-[var(--sa-navy)] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Kirim formulir pendaftaran
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
