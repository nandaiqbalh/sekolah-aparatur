import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  parseEnumParam,
  parsePageParam,
  parseSearchParam,
  parseSearchParamList,
} from "../lib/admin/parse-page-param"

describe("admin query params", () => {
  it("floors page numbers and falls back to 1", () => {
    assert.equal(parsePageParam("3"), 3)
    assert.equal(parsePageParam("2.9"), 2)
    assert.equal(parsePageParam(["4", "9"]), 4)
    assert.equal(parsePageParam("0"), 1)
    assert.equal(parsePageParam("nope"), 1)
    assert.equal(parsePageParam(undefined), 1)
  })

  it("trims search text and splits lists", () => {
    assert.equal(parseSearchParam("  admin  "), "admin")
    assert.equal(parseSearchParam("   "), undefined)
    assert.deepEqual(parseSearchParamList("a, b"), ["a", "b"])
    assert.deepEqual(parseSearchParamList(["a,b", "c"]), ["a", "b", "c"])
  })

  it("accepts only known enum values", () => {
    const allowed = ["active", "locked"] as const
    assert.equal(parseEnumParam("locked", allowed, "active"), "locked")
    assert.equal(parseEnumParam("other", allowed, "active"), "active")
  })
})
