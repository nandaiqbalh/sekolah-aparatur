"use client"

import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/shared/theme-provider"
import { Button } from "@/components/ui/button"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { cn } from "@/lib/utils"

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const dict = useDictionary()
  const isDark = theme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        isDark ? dict.common.theme.switchToLight : dict.common.theme.switchToDark
      }
      className={cn(
        "relative cursor-pointer overflow-hidden border-border/60 bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="sr-only">{dict.common.theme.toggle}</span>
    </Button>
  )
}
