"use client"

import * as React from "react"
import { ChevronsUpDown, Search, X } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type MultiSelectOption = {
  value: string
  label: string
}

type MultiSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  options: MultiSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyLabel?: string
  selectedCountLabel?: (count: number) => string
  disabled?: boolean
  className?: string
  allowClear?: boolean
  id?: string
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyLabel = "No results",
  selectedCountLabel = (count) => `${count} selected`,
  disabled = false,
  className,
  allowClear = false,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedSet = React.useMemo(() => new Set(value), [value])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    )
  }, [options, search])

  const triggerLabel = React.useMemo(() => {
    if (value.length === 0) return placeholder
    if (value.length === 1) {
      return options.find((o) => o.value === value[0])?.label ?? value[0]
    }
    return selectedCountLabel(value.length)
  }, [value, options, placeholder, selectedCountLabel])

  function toggle(optionValue: string) {
    if (selectedSet.has(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  function handleClear(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onChange([])
    setSearch("")
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (disabled) return
        setOpen(o)
        if (!o) setSearch("")
      }}
      modal={false}
    >
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cn(
          "inline-flex h-8 w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
          value.length === 0 && "text-muted-foreground",
          className,
        )}
      >
        <span className="truncate text-left">{triggerLabel}</span>
        <span className="flex shrink-0 items-center gap-1">
          {allowClear && value.length > 0 ? (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear"
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={handleClear}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <X className="size-3.5" />
            </span>
          ) : null}
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--anchor-width) min-w-[220px] max-w-[min(100vw-2rem,24rem)] p-0"
        align="start"
        sideOffset={4}
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
            autoFocus
          />
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            filtered.map((option) => {
              const checked = selectedSet.has(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggle(option.value)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(option.value)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={option.label}
                  />
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
