"use client"

import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateMessageStatusAction } from "@/features/pesan/actions/message-actions"
import { messageStatuses, type MessageStatus } from "@/features/pesan/schemas/message"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"

export function messageStatusLabel(
  status: MessageStatus,
  copy: {
    statusSubmitted: string
    statusRead: string
    statusReplied: string
    statusClosed: string
  },
) {
  if (status === "read") return copy.statusRead
  if (status === "replied") return copy.statusReplied
  if (status === "closed") return copy.statusClosed
  return copy.statusSubmitted
}

export function MessageStatusSelect({
  id,
  status,
  disabled,
}: {
  id: string
  status: MessageStatus
  disabled?: boolean
}) {
  const dict = useDictionary()
  const copy = dict.admin.pesan
  const [value, setValue] = useState(status)
  const [pending, setPending] = useState(false)

  async function change(next: string | null) {
    if (!next || next === value || !messageStatuses.includes(next as MessageStatus)) return
    const statusNext = next as MessageStatus
    setPending(true)
    const result = await updateMessageStatusAction({ id, status: statusNext })
    setPending(false)
    if (!result.ok) {
      toastError(dict.common.toastErrorTitle, result.message || copy.statusFailed)
      return
    }
    setValue(statusNext)
    toastSuccess(copy.statusUpdated, dict.common.toastStatusUpdatedDesc)
  }

  return (
    <Select value={value} onValueChange={(next) => void change(next)} disabled={disabled || pending}>
      <SelectTrigger className="w-full min-w-40 cursor-pointer bg-background" aria-label={copy.columnStatus}>
        <SelectValue>{(current: string | null) => messageStatusLabel((current as MessageStatus) || value, copy)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {messageStatuses.map((item) => (
          <SelectItem key={item} value={item}>
            {messageStatusLabel(item, copy)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
