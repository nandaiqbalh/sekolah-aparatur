"use client"

import { DictionaryProvider } from "@/lib/i18n/dictionary-provider"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function Providers({
  dictionary,
  children,
}: {
  dictionary: Dictionary
  children: React.ReactNode
}) {
  return (
    <DictionaryProvider dictionary={dictionary}>{children}</DictionaryProvider>
  )
}
