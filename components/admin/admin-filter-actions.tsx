"use client"

import { Button } from "@/components/ui/button"
import { useDictionary } from "@/lib/i18n/dictionary-provider"

type AdminFilterActionsProps = {
  pending?: boolean
  clearDisabled?: boolean
  onClear: () => void
}

export function AdminFilterActions({ pending, clearDisabled, onClear }: AdminFilterActionsProps) {
  const dict = useDictionary()

  return (
    <div className="col-span-full grid grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-row sm:gap-2">
      <Button type="submit" className="w-full cursor-pointer sm:w-auto" disabled={pending}>
        {dict.admin.applyFilter}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer sm:w-auto"
        disabled={pending || clearDisabled}
        onClick={onClear}
      >
        {dict.admin.clearFilters}
      </Button>
    </div>
  )
}
