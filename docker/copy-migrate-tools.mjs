/**
 * Copy Prisma CLI, tsx, and the seed runtime out of the full install.
 * The production image keeps Next's standalone node_modules, not this tree.
 */
import { spawnSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs"
import path from "node:path"

const destRoot = process.env.TOOLS_DIR ?? "/opt/tools"
const destModules = path.join(destRoot, "node_modules")
const roots = ["prisma", "tsx", "@prisma/adapter-pg", "pg", "bcryptjs", "@prisma/client"]

const lock = JSON.parse(readFileSync("package-lock.json", "utf8"))
const packages = lock.packages ?? {}

function resolveFrom(parentKey, name) {
  let dir = parentKey
  while (dir) {
    const candidate = `${dir}/node_modules/${name}`
    if (packages[candidate]) return candidate

    if (dir === "node_modules" || dir.endsWith("/node_modules")) {
      const slash = dir.lastIndexOf("/")
      dir = slash === -1 ? "" : dir.slice(0, slash)
      continue
    }

    const slash = dir.lastIndexOf("/")
    dir = slash === -1 ? "" : dir.slice(0, slash)
  }

  const root = `node_modules/${name}`
  return packages[root] ? root : null
}

const selected = new Set()
const queue = roots.map((name) => `node_modules/${name}`)

while (queue.length > 0) {
  const key = queue.pop()
  if (!key || selected.has(key) || !packages[key]) continue
  if (!existsSync(key)) continue
  selected.add(key)

  const pkg = packages[key]
  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.optionalDependencies ?? {}),
  }
  for (const name of Object.keys(deps)) {
    const next = resolveFrom(key, name)
    if (next) queue.push(next)
  }
}

if (selected.size === 0) {
  throw new Error("migrate tool copy found no packages")
}

rmSync(destRoot, { recursive: true, force: true })
mkdirSync(destModules, { recursive: true })

const copied = []
for (const key of [...selected].sort()) {
  if (copied.some((dir) => key === dir || key.startsWith(`${dir}/`))) continue
  const rel = key.slice("node_modules/".length)
  cpSync(key, path.join(destModules, rel), { recursive: true, dereference: true })
  copied.push(key)
}

const binDir = path.join(destModules, ".bin")
mkdirSync(binDir, { recursive: true })

for (const name of ["prisma", "tsx"]) {
  const pkg = JSON.parse(readFileSync(path.join(destModules, name, "package.json"), "utf8"))
  const bins = typeof pkg.bin === "string" ? { [name]: pkg.bin } : pkg.bin
  for (const [binName, relBin] of Object.entries(bins)) {
    symlinkSync(path.join("..", name, relBin), path.join(binDir, binName))
  }
}

const version = spawnSync(path.join(binDir, "prisma"), ["--version"], {
  encoding: "utf8",
})
if (version.status !== 0) {
  throw new Error(version.stderr || version.stdout || "prisma CLI failed to start")
}
