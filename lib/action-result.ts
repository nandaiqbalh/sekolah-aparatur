export type ActionResult<T> =
  | {
      ok: true
      data: T
      error: null
      message: string
      fieldErrors?: Record<string, string[]>
    }
  | {
      ok: false
      data: null
      error: string
      message: string
      fieldErrors?: Record<string, string[]>
    }

export function actionSuccess<T>(
  data: T,
  message = "Success"
): Extract<ActionResult<T>, { ok: true }> {
  return {
    ok: true,
    data,
    error: null,
    message,
  }
}

export function actionFailure(
  error: string,
  message: string,
  fieldErrors?: Record<string, string[]>
): Extract<ActionResult<never>, { ok: false }> {
  return {
    ok: false,
    data: null,
    error,
    message,
    fieldErrors,
  }
}
