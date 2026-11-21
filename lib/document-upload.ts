export const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024

export const DOCUMENT_TOO_LARGE_MESSAGE = "Ukuran berkas maksimal 15 MB."

export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const

export type DocumentMimeType = (typeof DOCUMENT_MIME_TYPES)[number]

const DOCUMENT_EXTENSION: Record<DocumentMimeType, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}

const DOCUMENT_FORMAT: Record<DocumentMimeType, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
}

export function isAllowedDocumentType(type: string): type is DocumentMimeType {
  return (DOCUMENT_MIME_TYPES as readonly string[]).includes(type)
}

export function documentExtensionFor(type: DocumentMimeType) {
  return DOCUMENT_EXTENSION[type]
}

export function documentFormatFor(type: DocumentMimeType) {
  return DOCUMENT_FORMAT[type]
}

export function isDocumentTooLarge(file: File) {
  return file.size > MAX_DOCUMENT_BYTES
}

export function formatDocumentSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  const megabytes = bytes / (1024 * 1024)
  const rounded = megabytes >= 10 ? Math.round(megabytes) : Math.round(megabytes * 10) / 10
  return `${rounded} MB`
}
