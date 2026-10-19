"use client"

import { useDictionary } from "@/lib/i18n/dictionary-provider"

export function AccessDenied() {
  const dict = useDictionary()
  return (
    <div className="flex max-w-lg flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        {dict.admin.accessDenied.title}
      </h1>
      <p className="text-muted-foreground">{dict.admin.accessDenied.description}</p>
    </div>
  )
}
