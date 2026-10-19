import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { actionFailure, actionSuccess } from "../lib/action-result"

describe("action result", () => {
  it("returns an ok payload", () => {
    assert.deepEqual(actionSuccess({ id: "1" }, "Saved"), {
      ok: true,
      data: { id: "1" },
      error: null,
      message: "Saved",
    })
  })

  it("returns a failure payload with field errors", () => {
    assert.deepEqual(actionFailure("VALIDATION_ERROR", "Invalid", { name: ["Required"] }), {
      ok: false,
      data: null,
      error: "VALIDATION_ERROR",
      message: "Invalid",
      fieldErrors: { name: ["Required"] },
    })
  })
})
