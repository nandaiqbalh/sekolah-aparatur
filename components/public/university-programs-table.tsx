import { universityProgramsTitle } from "@/data/university-programs"
import { programService, type PublicUniversityProgramRow } from "@/features/program/services/program-service"

function buildSpans(values: string[]) {
  const spans = values.map(() => 0)
  let index = 0
  while (index < values.length) {
    let count = 1
    while (index + count < values.length && values[index + count] === values[index]) {
      count += 1
    }
    spans[index] = count
    index += count
  }
  return spans
}

function withUniversityNumbers(rows: PublicUniversityProgramRow[]) {
  const numbers = new Map<string, number>()
  let next = 1
  return rows.map((row) => {
    let no = numbers.get(row.university)
    if (!no) {
      no = next
      numbers.set(row.university, no)
      next += 1
    }
    return { ...row, no }
  })
}

export async function UniversityProgramsTable() {
  const rows = withUniversityNumbers(await programService.listPublishedStudies())
  if (rows.length === 0) return null

  const universityKeys = rows.map((row) => `${row.no}:${row.university}`)
  const studyKeys = rows.map((row) => `${row.no}:${row.university}:${row.study}`)
  const universitySpans = buildSpans(universityKeys)
  const studySpans = buildSpans(studyKeys)

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--sa-navy)] sm:text-4xl">
        {universityProgramsTitle}
      </h2>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-[var(--sa-line)] bg-white">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[var(--sa-navy)] text-white">
              <th className="px-4 py-3 font-semibold">No</th>
              <th className="px-4 py-3 font-semibold">Universitas</th>
              <th className="px-4 py-3 font-semibold">Program studi</th>
              <th className="px-4 py-3 font-semibold">Strata</th>
              <th className="px-4 py-3 font-semibold">Konsentrasi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const showUniversity = universitySpans[index] > 0
              const showStudy = studySpans[index] > 0
              const zebra = index % 2 === 0 ? "bg-white" : "bg-[var(--sa-canvas)]"

              return (
                <tr key={`${row.no}-${row.study}-${row.strata}-${row.concentration ?? "none"}-${index}`} className={zebra}>
                  {showUniversity ? (
                    <td
                      rowSpan={universitySpans[index]}
                      className="align-top px-4 py-3 font-semibold text-[var(--sa-navy)]"
                    >
                      {row.no}
                    </td>
                  ) : null}
                  {showUniversity ? (
                    <td
                      rowSpan={universitySpans[index]}
                      className="align-top px-4 py-3 font-semibold text-[var(--sa-navy)]"
                    >
                      {row.university}
                    </td>
                  ) : null}
                  {showStudy ? (
                    <td rowSpan={studySpans[index]} className="align-top px-4 py-3 text-[var(--sa-muted)]">
                      {row.study}
                    </td>
                  ) : null}
                  <td className="px-4 py-3 font-semibold text-[var(--sa-navy)]">{row.strata}</td>
                  <td className="px-4 py-3 text-[var(--sa-muted)]">{row.concentration ?? "—"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
