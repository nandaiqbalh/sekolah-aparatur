import { PageLoadingMarker } from "@/components/public/page-transition"

export default function Loading() {
  return (
    <div
      className="flex min-h-[100svh] flex-col items-center justify-center gap-3"
      aria-live="polite"
      aria-busy="true"
    >
      <PageLoadingMarker />
      <div className="h-1 w-40 overflow-hidden rounded-full bg-[var(--sa-line)]">
        <div className="h-full w-1/2 animate-nav-progress rounded-full bg-[var(--sa-gold)]" />
      </div>
      <p className="text-sm font-semibold text-[var(--sa-navy)]">Memuat halaman</p>
    </div>
  )
}
