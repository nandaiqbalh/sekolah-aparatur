import assert from "node:assert/strict"
import path from "node:path"
import { describe, it } from "node:test"

import { resolveUploadPath } from "../lib/upload-path"

const root = path.join("/app", "public", "uploads")

describe("resolveUploadPath", () => {
  it("resolves an uploaded image inside the uploads directory", () => {
    const resolved = resolveUploadPath(root, ["program", "d49a3f88-3cd2-4e75-b8b5-7ab0a93756a1.png"])
    assert.equal(resolved?.contentType, "image/png")
    assert.equal(
      resolved?.filePath,
      path.join(root, "program", "d49a3f88-3cd2-4e75-b8b5-7ab0a93756a1.png"),
    )
  })

  it("rejects paths that leave the uploads directory", () => {
    assert.equal(resolveUploadPath(root, ["..", "etc", "passwd"]), null)
    assert.equal(resolveUploadPath(root, ["program", "..", "secret.png"]), null)
  })

  it("rejects files that are not images", () => {
    assert.equal(resolveUploadPath(root, ["program", "notes.txt"]), null)
    assert.equal(resolveUploadPath(root, []), null)
  })
})
