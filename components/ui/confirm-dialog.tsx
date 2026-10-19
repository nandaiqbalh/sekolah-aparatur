"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Loader2,
  X,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { preventUnintendedDialogDismiss } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type DialogType = "success" | "error" | "warning" | "info" | "confirm"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: DialogType
  title: string
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string | null
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  showCancel?: boolean
}

const typeConfig: Record<
  DialogType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  success: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  error: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  confirm: {
    icon: HelpCircle,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  type = "confirm",
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  showCancel,
}: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false)
  const cfg = typeConfig[type]
  const Icon = cfg.icon
  const isConfirm = type === "confirm"
  const showCancelBtn = showCancel ?? isConfirm
  const confirmText = confirmLabel ?? (isConfirm ? "Confirm" : "OK")
  const finalCancelLabel = cancelLabel ?? "Cancel"

  const handleConfirm = async () => {
    if (!onConfirm) {
      onOpenChange(false)
      return
    }
    setPending(true)
    try {
      await onConfirm()
    } finally {
      setPending(false)
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog.Root
      open={open}
      disablePointerDismissal
      onOpenChange={preventUnintendedDialogDismiss(onOpenChange)}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm data-closed:pointer-events-none data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[61] w-[calc(100%-3rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-6 shadow-lg ring-1 ring-foreground/10 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95">
          <div className="flex justify-center">
            <div className={cn("flex size-14 items-center justify-center rounded-full", cfg.bgColor)}>
              <Icon className={cn("size-7", cfg.color)} />
            </div>
          </div>
          <Dialog.Title className="mt-4 text-center text-lg font-semibold">{title}</Dialog.Title>
          {message ? (
            <Dialog.Description className="mt-1 text-center text-sm text-muted-foreground">
              {message}
            </Dialog.Description>
          ) : null}
          <div className="mt-6 flex justify-center gap-3">
            {showCancelBtn ? (
              <Button onClick={handleCancel} disabled={pending} variant="outline">
                {finalCancelLabel}
              </Button>
            ) : null}
            <Button
              onClick={handleConfirm}
              disabled={pending}
              variant="default"
              className={cn(
                type === "error" || type === "warning"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : "border-border",
              )}
            >
              {pending && <Loader2 className="animate-spin" />}
              {confirmText}
            </Button>
          </div>
          <Dialog.Close
            aria-label="Close"
            className="absolute top-3 right-3 flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
