import "server-only"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { connection } from "next/server"

import { institutionProfileRepository } from "@/features/profil/repositories/institution-profile-repository"
import {
  latarBelakangPointSchema,
  type InstitutionProfileDto,
  type InstitutionProfileFormValues,
} from "@/features/profil/schemas/institution-profile"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"

type ProfileRow = NonNullable<Awaited<ReturnType<typeof institutionProfileRepository.find>>>

const IMAGE_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

function toDto(row: ProfileRow): InstitutionProfileDto {
  const points = latarBelakangPointSchema.array().safeParse(row.latarBelakangPoints)
  return {
    key: row.key,
    heroEyebrow: row.heroEyebrow,
    heroTitle: row.heroTitle,
    heroDescription: row.heroDescription ?? "",
    lembagaImage: row.lembagaImage,
    lembagaBody: row.lembagaBody ?? "",
    latarBelakangParagraphs: row.latarBelakangParagraphs,
    latarBelakangPoints: points.success ? points.data : [],
    visi: row.visi,
    misi: row.misi,
    rplParagraphs: row.rplParagraphs,
    legalBasis: row.legalBasis,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const institutionProfileService = {
  async get(): Promise<InstitutionProfileDto | null> {
    await connection()
    const row = await institutionProfileRepository.find()
    return row ? toDto(row) : null
  },

  async update(values: InstitutionProfileFormValues): Promise<ActionResult<InstitutionProfileDto>> {
    const row = await institutionProfileRepository.upsert({
      heroEyebrow: values.heroEyebrow,
      heroTitle: values.heroTitle,
      heroDescription: values.heroDescription.length > 0 ? values.heroDescription : null,
      lembagaImage: values.lembagaImage,
      lembagaBody: values.lembagaBody.length > 0 ? values.lembagaBody : null,
      latarBelakangParagraphs: values.latarBelakangParagraphs,
      latarBelakangPoints: values.latarBelakangPoints,
      visi: values.visi,
      misi: values.misi,
      rplParagraphs: values.rplParagraphs,
      legalBasis: values.legalBasis,
    })
    return actionSuccess(toDto(row), "Profil program diperbarui.")
  },

  async saveImage(file: { type: string; bytes: Buffer }): Promise<ActionResult<{ path: string }>> {
    const extension = IMAGE_EXTENSION[file.type]
    if (!extension) {
      return actionFailure("VALIDATION_ERROR", "Gambar harus JPEG, PNG, atau WebP.")
    }

    const filename = `${crypto.randomUUID()}.${extension}`
    const directory = path.join(process.cwd(), "public", "uploads", "profil")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), file.bytes)
    return actionSuccess({ path: `/uploads/profil/${filename}` })
  },
}
