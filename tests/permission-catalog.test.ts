import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  PERMISSION_CATALOG,
  adminRolePermissionKeys,
  isSuperAdminOnlyPermission,
  permissionDescriptionJson,
} from "../lib/rbac/permission-catalog"

describe("permission catalog", () => {
  it("keeps permission keys unique", () => {
    const keys = PERMISSION_CATALOG.map((permission) => permission.key)
    assert.equal(new Set(keys).size, keys.length)
  })

  it("limits the admin role to dashboard and public-content permissions", () => {
    const keys = adminRolePermissionKeys()
    assert.ok(keys.includes("dashboard.view"))
    assert.ok(keys.includes("informasi.view"))
    assert.ok(keys.includes("galeri.view"))
    assert.ok(keys.includes("profil.view"))
    assert.ok(keys.includes("hero.view"))
    assert.ok(keys.includes("mitra.view"))
    assert.ok(keys.includes("pendaftaran.view"))
    assert.ok(keys.includes("pesan.view"))
    assert.ok(keys.includes("program.view"))
    assert.ok(keys.includes("kontak.view"))
    assert.equal(keys.some((key) => key.startsWith("users.")), false)
  })

  it("marks system modules as super-admin only", () => {
    assert.equal(isSuperAdminOnlyPermission("users.view"), true)
    assert.equal(isSuperAdminOnlyPermission("dashboard.view"), false)
    assert.equal(isSuperAdminOnlyPermission("informasi.view"), false)
    assert.equal(isSuperAdminOnlyPermission("galeri.view"), false)
    assert.equal(isSuperAdminOnlyPermission("profil.view"), false)
    assert.equal(isSuperAdminOnlyPermission("hero.view"), false)
    assert.equal(isSuperAdminOnlyPermission("mitra.view"), false)
    assert.equal(isSuperAdminOnlyPermission("pendaftaran.view"), false)
    assert.equal(isSuperAdminOnlyPermission("pesan.view"), false)
    assert.equal(isSuperAdminOnlyPermission("program.view"), false)
    assert.equal(isSuperAdminOnlyPermission("kontak.view"), false)
  })

  it("stores the same description for both locales", () => {
    assert.deepEqual(permissionDescriptionJson("Lihat dashboard admin"), {
      en: "Lihat dashboard admin",
      id: "Lihat dashboard admin",
    })
  })
})