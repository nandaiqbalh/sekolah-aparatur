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
  const pengantar = program.sections.find((block) => block.title === "Pengantar")
  const rest = program.sections.filter((block) => block.title !== "Pengantar")
  const parts = [
    section(
      "Program studi yang ditawarkan",
      `<ul>${program.studies
        .map((study) => {
          const label = study.level === study.name ? study.level : `${study.level} — ${study.name}`
          return `<li><strong>${escapeHtml(label)}.</strong> ${escapeHtml(study.track)}. ${escapeHtml(study.detail)}</li>`
        })
        .join("")}</ul>`,
    ),
    ...(pengantar ? [blockHtml(pengantar)] : []),
    section(
      "Keunggulan program",
      `<ul>${program.highlights
        .map((item) => `<li><strong>${escapeHtml(item.title)}.</strong> ${escapeHtml(item.description)}</li>`)
        .join("")}</ul>`,
    ),
    ...rest.map(blockHtml),
    section(
      "Masa pendaftaran dan pemberkasan",
      `<ul>${program.registrationPeriods
        .map((period) => `<li><strong>${escapeHtml(period.term)}.</strong> ${escapeHtml(period.detail)}</li>`)
        .join("")}</ul>`,
    ),
    section(
      "Kampus penyelenggara",
      `<p><strong>${escapeHtml(program.campus.name)}.</strong> ${escapeHtml(program.campus.description)}</p><p>${escapeHtml(program.campus.address)}</p>`,
    ),
  ]

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
