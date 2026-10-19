import type { Metadata } from "next"
import { Cormorant_Garamond, Geist, Geist_Mono, Plus_Jakarta_Sans, Red_Hat_Text } from "next/font/google"
import { cookies } from "next/headers"

import { ThemeProvider } from "@/components/shared/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { getLocale } from "@/lib/i18n/get-locale"
import { getSiteUrl } from "@/lib/site"
import { THEME_COOKIE_NAME, parseTheme } from "@/lib/theme-cookie"
import { getThemeInitScript } from "@/lib/theme-script"
import { cn } from "@/lib/utils"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "600", "700"],
})

const redHat = Red_Hat_Text({
  subsets: ["latin"],
  variable: "--font-red-hat",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const cookieStore = await cookies()
  const initialTheme =
    parseTheme(cookieStore.get(THEME_COOKIE_NAME)?.value) ?? "light"

  return (
    <html
      lang={locale}
      className={cn(
        geistSans.variable,
        geistMono.variable,
        cormorant.variable,
        redHat.variable,
        plusJakartaSans.variable,
        "h-full antialiased",
        initialTheme === "dark" && "dark"
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeInitScript(THEME_COOKIE_NAME, initialTheme),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          defaultTheme={initialTheme}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
