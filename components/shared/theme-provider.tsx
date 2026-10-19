"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { setThemeCookie, type Theme } from "@/lib/theme-cookie"

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  disableTransitionOnChange?: boolean
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  resolvedTheme: Theme
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function disableTransitions() {
  const css = document.createElement("style")
  css.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(css)

  return () => {
    window.getComputedStyle(document.body)
    setTimeout(() => {
      document.head.removeChild(css)
    }, 1)
  }
}

function applyTheme(theme: Theme, disableTransition = false) {
  const restore = disableTransition ? disableTransitions() : undefined
  const root = document.documentElement

  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme

  restore?.()
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  useEffect(() => {
    applyTheme(theme, disableTransitionOnChange)
  }, [theme, disableTransitionOnChange])

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    setThemeCookie(nextTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const nextTheme = current === "dark" ? "light" : "dark"
      setThemeCookie(nextTheme)
      return nextTheme
    })
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      resolvedTheme: theme,
    }),
    [theme, setTheme, toggleTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
      resolvedTheme: "light" as Theme,
    }
  }

  return context
}

export type { Theme }
