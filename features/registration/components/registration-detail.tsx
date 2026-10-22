"use client"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { RegistrationStatusSelect } from "@/features/registration/components/registration-status-select"
import type { RegistrationDto } from "@/features/registration/schemas/registration"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { ADMIN_ROUTES } from "@/lib/routes"

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(value))
}

export function RegistrationDetail({
  registration,
  programTitle,
  canUpdate,
}: {
  registration: RegistrationDto
  programTitle: string
  canUpdate: boolean
}) {
  const copy = useDictionary().admin.pendaftaran
  const program = programTitle
  const rows = [
    [copy.columnProgram, program],
    [copy.email, registration.email],
    [copy.columnWhatsapp, registration.whatsapp],
    [copy.institution, registration.institution],
    [copy.position, registration.position],
    [copy.address, registration.address],
    [copy.columnDate, formatSubmittedAt(registration.createdAt)],
  ] as const

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={registration.name}
        description={copy.detail}
        backHref={ADMIN_ROUTES.pendaftaran}
        backLabel={copy.backToList}
      />
      <dl className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className={label === copy.address ? "sm:col-span-2" : undefined}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm">{value}</dd>
          </div>
        ))}
        <div>
          <dt className="text-sm text-muted-foreground">{copy.columnStatus}</dt>
          <dd className="mt-2 max-w-xs">
            <RegistrationStatusSelect id={registration.id} status={registration.status} disabled={!canUpdate} />
          </dd>
        </div>
      </dl>
    </div>
  )
}
