"use client"

import type { FormEvent, ReactNode } from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export const ADMIN_FILTER_CONTROL_CLASS = "w-full bg-background"

type AdminFilterBarProps = {
  children: ReactNode
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  className?: string
}

export function AdminFilterBar({ children, onSubmit, className }: AdminFilterBarProps) {
  return (
    <form
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}

type AdminFilterFieldProps = {
  children: ReactNode
  label?: string
  className?: string
}

export function AdminFilterField({ children, label, className }: AdminFilterFieldProps) {
  return (
    <div className={cn("w-full min-w-0 space-y-1", className)}>
      {label ? <Label>{label}</Label> : null}
      {children}
    </div>
  )
}
