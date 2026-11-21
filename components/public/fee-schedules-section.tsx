import { feeScheduleService } from "@/features/biaya/services/fee-schedule-service"
import type { FeeLineDto, PublicFeeSchedule } from "@/features/biaya/schemas/fee-schedule"

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function itemNumber(lines: FeeLineDto[], index: number) {
  const line = lines[index]
  if (!line || line.kind !== "item") return ""
  let count = 0
  for (let i = 0; i <= index; i += 1) {
    if (lines[i]?.kind === "item") count += 1
  }
  return `${count}.`
}

function FeeScheduleBlock({ schedule }: { schedule: PublicFeeSchedule }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--sa-navy)] sm:text-4xl">
          {schedule.title}
        </h2>
        {schedule.subtitle.trim() ? (
          <p className="mt-2 text-base font-semibold text-[var(--sa-navy)]">{schedule.subtitle}</p>
        ) : null}
      </div>

      {schedule.groups.map((group, groupIndex) => (
        <div key={`${schedule.id}-${group.title}-${groupIndex}`}>
          <h3 className="text-xl font-semibold tracking-tight text-[var(--sa-navy)]">
            {groupIndex + 1}. {group.title}
          </h3>
          <div className="mt-4 overflow-x-auto rounded-3xl border border-[var(--sa-line)] bg-white">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[var(--sa-navy)] text-white">
                  <th className="px-4 py-3 font-semibold">No</th>
                  <th className="px-4 py-3 font-semibold">Rincian</th>
                  <th className="px-4 py-3 font-semibold">Biaya</th>
                  <th className="px-4 py-3 font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {group.lines.map((line, lineIndex) => {
                  const emphasis = line.kind === "subtotal" || line.kind === "total"
                  const zebra = lineIndex % 2 === 0 ? "bg-white" : "bg-[var(--sa-canvas)]"
                  return (
                    <tr
                      key={`${group.title}-${line.label}-${lineIndex}`}
                      className={emphasis ? "bg-[var(--sa-canvas)] font-semibold text-[var(--sa-navy)]" : zebra}
                    >
                      <td className="px-4 py-3 align-top">{itemNumber(group.lines, lineIndex)}</td>
                      <td className="px-4 py-3 align-top">{line.label}</td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">{formatRupiah(line.amount)}</td>
                      <td className="px-4 py-3 align-top text-[var(--sa-muted)]">{line.note ?? ""}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

export async function FeeSchedulesSection() {
  const schedules = await feeScheduleService.listPublished()
  if (schedules.length === 0) return null

  return (
    <div className="space-y-12">
      {schedules.map((schedule) => (
        <FeeScheduleBlock key={schedule.id} schedule={schedule} />
      ))}
    </div>
  )
}
