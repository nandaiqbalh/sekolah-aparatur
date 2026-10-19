import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { z } from "zod"

import { parseInput } from "../lib/parse-input"

const schema = z.object({
  name: z.string().min(1),
})

describe("parseInput", () => {
  it("returns parsed data", () => {
    const result = parseInput(schema, { name: "Ada" })
    assert.equal(result.ok, true)
    if (result.ok) assert.deepEqual(result.data, { name: "Ada" })
  })

  it("maps Zod issues onto ActionResult field errors", () => {
    const result = parseInput(schema, { name: "" })
    assert.equal(result.ok, false)
    if (!result.ok) {
      assert.equal(result.result.error, "VALIDATION_ERROR")
      assert.ok(result.result.fieldErrors?.name?.length)
    }
  })
})
