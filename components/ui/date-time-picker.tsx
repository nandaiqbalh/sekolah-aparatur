"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DatePicker({
  value,
  onChange,
  placeholder,
  id,
  disabled,
  className,
}: {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  id?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <Popover modal>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        data-empty={!value}
        className={cn(
          "inline-flex h-8 w-full cursor-pointer items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[empty=true]:text-muted-foreground",
          className,
        )}
      >
        <CalendarIcon className="size-4 shrink-0" />
        {value ? format(value, "PPP") : <span>{placeholder ?? "Pick a date"}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} autoFocus />
      </PopoverContent>
    </Popover>
  )
}

function parseDateString(value: string): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  const date = new Date(year, month - 1, day)
  return isNaN(date.getTime()) ? undefined : date
}

export function DateField({
  value,
  onChange,
  placeholder,
  disabled,
  id,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
}) {
  const date = parseDateString(value)

  return (
    <DatePicker
      id={id}
      value={date}
      disabled={disabled}
      placeholder={placeholder}
      className={cn("w-[160px]", className)}
      onChange={(selected) => {
        if (!selected) {
          onChange("")
          return
        }
        onChange(format(selected, "yyyy-MM-dd"))
      }}
    />
  )
}
