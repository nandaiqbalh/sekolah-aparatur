import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

import { resolveUploadPath } from "@/lib/upload-path"

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads")

export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ path: string[] }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { path: segments } = await context.params
  const resolved = resolveUploadPath(UPLOAD_ROOT, segments)
  if (!resolved) return new NextResponse(null, { status: 404 })

  try {
    const bytes = await readFile(resolved.filePath)
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": resolved.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
