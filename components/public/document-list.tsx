import type { ProgramDocument } from "@/data/programs"

export function DocumentList({ documents }: { documents: ProgramDocument[] }) {
  return (
    <ul className="divide-y divide-[var(--sa-line)] border-b border-[var(--sa-line)]">
      {documents.map((document) => (
        <li key={document.name} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-[var(--sa-ink)]">{document.name}</p>
            <p className="mt-1 text-sm text-[var(--sa-muted)]">
              {document.format}
              {document.size ? ` · ${document.size}` : " · ukuran menyusul"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--sa-muted)]">{document.description}</p>
          </div>
          <button
            type="button"
            disabled
            className="cursor-not-allowed text-left text-sm text-[var(--sa-muted)]"
          >
            Unduh belum tersedia
          </button>
        </li>
      ))}
    </ul>
  )
}
