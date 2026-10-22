"use client"

import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateRegistrationStatusAction } from "@/features/registration/actions/registration-actions"
import { registrationStatuses, type RegistrationStatus } from "@/features/registration/schemas/registration"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"

export function registrationStatusLabel(
  status: RegistrationStatus,
  copy: {
    statusSubmitted: string
    statusContacted: string
    statusAccepted: string
    statusDeclined: string
  },
) {
  if (status === "contacted") return copy.statusContacted
  if (status === "accepted") return copy.statusAccepted
  if (status === "declined") return copy.statusDeclined
  return copy.statusSubmitted
}

export function RegistrationStatusSelect({
  id,
  status,
  disabled,
  onUpdated,
}: {
  id: string
  status: RegistrationStatus
  disabled?: boolean
  onUpdated?: (status: RegistrationStatus) => void
}) {
  const dict = useDictionary()
  const copy = dict.admin.pendaftaran
  const [value, setValue] = useState(status)
  const [pending, setPending] = useState(false)

  async function change(next: string | null) {
    if (!next || next === value || !registrationStatuses.includes(next as RegistrationStatus)) return
    const statusNext = next as RegistrationStatus
    setPending(true)
    const result = await updateRegistrationStatusAction({ id, status: statusNext })
    setPending(false)
    if (!result.ok) {
      toastError(dict.common.toastErrorTitle, result.message || copy.statusFailed)
      return
    }
    setValue(statusNext)
    onUpdated?.(statusNext)
    toastSuccess(copy.statusUpdated, dict.common.toastStatusUpdatedDesc)
  }

  return (
    <Select value={value} onValueChange={(next) => void change(next)} disabled={disabled || pending}>
      <SelectTrigger className="w-full min-w-40 cursor-pointer bg-background" aria-label={copy.columnStatus}>
        <SelectValue>{(current: string | null) => registrationStatusLabel((current as RegistrationStatus) || value, copy)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {registrationStatuses.map((item) => (
          <SelectItem key={item} value={item}>
            {registrationStatusLabel(item, copy)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
