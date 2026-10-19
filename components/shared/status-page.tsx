import Link from "next/link"

export function StatusPage({
  statusCode,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  statusCode?: string | number
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      {statusCode != null ? (
        <p className="text-sm font-medium text-muted-foreground">{statusCode}</p>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
      <Link
        href={ctaHref}
        className="mt-2 text-sm font-medium underline underline-offset-4"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
