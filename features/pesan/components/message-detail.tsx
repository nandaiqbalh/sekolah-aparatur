"use client"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { MessageStatusSelect } from "@/features/pesan/components/message-status-select"
import type { MessageDto } from "@/features/pesan/schemas/message"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { ADMIN_ROUTES } from "@/lib/routes"

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(value))
}

export function MessageDetail({ message, canUpdate }: { message: MessageDto; canUpdate: boolean }) {
  const copy = useDictionary().admin.pesan

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={message.name}
        description={copy.detail}
        backHref={ADMIN_ROUTES.pesan}
        backLabel={copy.backToList}
      />
      <dl className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">{copy.columnContact}</dt>
          <dd className="mt-1 text-sm">{message.contact}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">{copy.columnDate}</dt>
          <dd className="mt-1 text-sm">{formatSubmittedAt(message.createdAt)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm text-muted-foreground">{copy.columnMessage}</dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm">{message.message}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">{copy.columnStatus}</dt>
          <dd className="mt-2 max-w-xs">
            <MessageStatusSelect id={message.id} status={message.status} disabled={!canUpdate} />
          </dd>
        </div>
      </dl>
    </div>
  )
}
