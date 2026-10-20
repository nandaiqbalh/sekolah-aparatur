import type { Program, ProgramBlock } from "@/data/programs"

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function section(title: string, body: string): string {
  return `<h2>${escapeHtml(title)}</h2>${body}`
}

function blockHtml(block: ProgramBlock): string {
  if (block.kind === "paragraphs") {
    return section(block.title, block.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(""))
  }

  if (block.kind === "list") {
    return section(block.title, `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`)
  }

  if (block.kind === "steps") {
    return section(
      block.title,
      `<ol>${block.steps
        .map((step) => `<li><strong>${escapeHtml(step.title)}.</strong> ${escapeHtml(step.body)}</li>`)
        .join("")}</ol>`,
    )
  }

  const head = block.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")
  const rows = block.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("")
  return section(
    block.title,
    `<div class="program-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`,
  )
}

/** HTML rincian program. Nanti diganti keluaran HTML editor (boleh pakai .program-section). */
export function programBodyHtml(program: Program): string {
  const parts = [
    section("Peserta", `<p>${escapeHtml(program.audience)}</p>`),
    section("Kalender akademik", `<p>${escapeHtml(program.scheduleNote)}</p>`),
    section("Pembiayaan", `<p>${escapeHtml(program.feeNote)}</p>`),
    ...program.sections.map(blockHtml),
  ]

  if (program.requirements.length > 0) {
    parts.push(
      section(
        "Dokumen persyaratan",
        `<ul>${program.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`,
      ),
    )
  }

  if (program.documents.length > 0) {
    parts.push(
      section(
        "Unduhan",
        `<ul>${program.documents
          .map(
            (document) =>
              `<li><strong>${escapeHtml(document.name)}</strong> (${escapeHtml(document.format)}). ${escapeHtml(document.description)}</li>`,
          )
          .join("")}</ul>`,
      ),
    )
  }

  return parts.join("")
}
