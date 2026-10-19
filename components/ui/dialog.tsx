"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const UNINTENDED_DIALOG_DISMISS_REASONS = new Set([
  "escape-key",
  "outside-press",
  "focus-out",
  "close-watcher",
])

export function isUnintendedDialogDismiss(reason: string) {
  return UNINTENDED_DIALOG_DISMISS_REASONS.has(reason)
}

export function preventUnintendedDialogDismiss(
  onOpenChange?: DialogPrimitive.Root.Props["onOpenChange"],
): NonNullable<DialogPrimitive.Root.Props["onOpenChange"]> {
  return (open, eventDetails) => {
    if (!open && isUnintendedDialogDismiss(eventDetails.reason)) {
      eventDetails.cancel()
      return
    }
    onOpenChange?.(open, eventDetails)
  }
}

function Dialog({
  intendedCloseOnly = false,
  disablePointerDismissal,
  onOpenChange,
  ...props
}: DialogPrimitive.Root.Props & { intendedCloseOnly?: boolean }) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
      disablePointerDismissal={intendedCloseOnly || disablePointerDismissal}
      onOpenChange={
        intendedCloseOnly ? preventUnintendedDialogDismiss(onOpenChange) : onOpenChange
      }
    />
  )
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm data-closed:pointer-events-none data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = false,
  closeLabel = "Close",
  overlayClassName,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  closeLabel?: string
  overlayClassName?: string
}) {
  return (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-[61] flex max-h-[calc(100dvh-3rem)] w-[calc(100%-3rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg ring-1 ring-foreground/10 outline-none",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogClose
            aria-label={closeLabel}
            className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </DialogClose>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 px-6 py-5 text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
