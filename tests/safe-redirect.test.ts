import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  ADMIN_DEFAULT_REDIRECT,
  ADMIN_LOGIN_PATH,
  isSafeInternalPath,
  safeAdminRedirect,
  withLoginRedirect,
} from "../lib/auth/safe-redirect"

describe("admin redirects", () => {
  it("accepts a single-slash internal path", () => {
    assert.equal(isSafeInternalPath("/admin/users"), true)
  })

  it("rejects open redirects", () => {
    assert.equal(isSafeInternalPath("//evil.example"), false)
    assert.equal(isSafeInternalPath("https://evil.example"), false)
    assert.equal(isSafeInternalPath("/admin\\users"), false)
  })

  it("keeps staff inside the admin area", () => {
    assert.equal(safeAdminRedirect("/admin/users"), "/admin/users")
    assert.equal(safeAdminRedirect("/en"), ADMIN_DEFAULT_REDIRECT)
    assert.equal(safeAdminRedirect("/admin/login"), ADMIN_DEFAULT_REDIRECT)
    assert.equal(safeAdminRedirect(null), ADMIN_DEFAULT_REDIRECT)
  })

  it("adds a redirect query only for protected admin paths", () => {
    assert.equal(
      withLoginRedirect(ADMIN_LOGIN_PATH, "/admin/users"),
      "/admin/login?redirect=%2Fadmin%2Fusers",
    )
    assert.equal(withLoginRedirect(ADMIN_LOGIN_PATH, "/admin/login"), ADMIN_LOGIN_PATH)
  })
})
