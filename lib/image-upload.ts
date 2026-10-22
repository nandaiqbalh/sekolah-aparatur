export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export const IMAGE_TOO_LARGE_MESSAGE = "Ukuran gambar maksimal 2 MB."

export function isImageTooLarge(file: File) {
  return file.size > MAX_IMAGE_BYTES
}

export function isBodyLimitError(error: unknown) {
  const message = error instanceof Error ? error.message : ""
  return /body exceeded|body size limit/i.test(message)
}
