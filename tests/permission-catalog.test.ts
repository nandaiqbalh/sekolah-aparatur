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

  it("limits the admin role to dashboard permissions", () => {
    const keys = adminRolePermissionKeys()
    assert.ok(keys.includes("dashboard.view"))
    assert.equal(keys.some((key) => key.startsWith("users.")), false)
  })

  it("marks system modules as super-admin only", () => {
    assert.equal(isSuperAdminOnlyPermission("users.view"), true)
    assert.equal(isSuperAdminOnlyPermission("dashboard.view"), false)
  })

  it("stores the same description for both locales", () => {
    assert.deepEqual(permissionDescriptionJson("Lihat dashboard admin"), {
      en: "Lihat dashboard admin",
      id: "Lihat dashboard admin",
    })
  })
})