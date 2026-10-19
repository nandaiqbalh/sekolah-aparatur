import { toast as sonnerToast, type ExternalToast } from "sonner"

export { toast as sonnerToast } from "sonner"

type ToastOptions = ExternalToast

function mergeOptions(description: string, options?: ToastOptions): ToastOptions {
  return { ...options, description: options?.description ?? description }
}

export function toastSuccess(title: string, description: string, options?: ToastOptions) {
  return sonnerToast.success(title, mergeOptions(description, options))
}

export function toastError(title: string, description: string, options?: ToastOptions) {
  return sonnerToast.error(title, mergeOptions(description, options))
}

export function toastInfo(title: string, description: string, options?: ToastOptions) {
  return sonnerToast.info(title, mergeOptions(description, options))
}

export function toastWarning(title: string, description: string, options?: ToastOptions) {
  return sonnerToast.warning(title, mergeOptions(description, options))
}
