import path from "node:path"

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
}

export function resolveUploadPath(root: string, segments: string[]) {
  if (segments.length === 0) return null
  if (segments.some((part) => part !== path.basename(part) || part === "." || part === "..")) {
    return null
  }

  const contentType = CONTENT_TYPES[path.extname(segments.at(-1) ?? "").toLowerCase()]
  if (!contentType) return null

  const rootPath = path.resolve(root)
  const filePath = path.resolve(rootPath, ...segments)
  if (filePath !== rootPath && !filePath.startsWith(`${rootPath}${path.sep}`)) return null

  return { filePath, contentType }
}
