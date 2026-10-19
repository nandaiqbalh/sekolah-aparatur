import Link from "next/link"

import { cn } from "@/lib/utils"

export function AdminAuthBrandHeader({
  brandName,
  logoUrl,
  backofficeLabel,
}: {
  brandName: string
  logoUrl: string | null | undefined
  backofficeLabel: string
}) {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      {logoUrl ? (
        <Link href="/" className="inline-flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={brandName}
            className="mx-auto h-9 w-auto object-contain"
          />
        </Link>
      ) : brandName ? (
        <Link
          href="/"
          className={cn(
            "inline-flex text-lg font-semibold tracking-tight",
            !logoUrl && "text-foreground",
          )}
        >
          {brandName}
        </Link>
      ) : null}
      <p className="mt-1.5 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
        {backofficeLabel}
      </p>
    </div>
  )
}
