import admin from "./admin"
import common from "./common"
import errors from "./errors"
import home from "./home"
import meta from "./meta"
import type { Dictionary } from "../en"

const dict = {
  admin,
  common,
  errors,
  home,
  meta,
} as const satisfies Dictionary

export default dict
