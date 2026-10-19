"use client"

import type { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AdminFormDialog({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  closeLabel: string
  children: ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} intendedCloseOnly>
      <DialogContent showCloseButton closeLabel={closeLabel} className="max-w-lg">
        <DialogHeader className="pr-12">
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {open ? children : null}
      </DialogContent>
    </Dialog>
  )
}

export { DialogFooter }
