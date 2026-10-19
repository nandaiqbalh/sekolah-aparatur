import admin from "./admin"
import common from "./common"
import errors from "./errors"
import home from "./home"
import meta from "./meta"

const dict = {
  admin,
  common,
  errors,
  home,
  meta,
} as const

type WidenValues<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly WidenValues<U>[]
    : T extends object
      ? { [K in keyof T]: WidenValues<T[K]> }
      : string

export type Dictionary = WidenValues<typeof dict>

export default dict
