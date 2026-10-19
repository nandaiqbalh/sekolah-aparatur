import Link from "next/link"

import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import { localizedPath, ADMIN_ROUTES } from "@/lib/routes"
import { DOCS_URL, GITHUB_REPO_URL, SITE_NAME } from "@/lib/site"

export function PublicFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const wordmark = SITE_NAME.toUpperCase()
  const linkClassName =
    "text-base leading-[1.2] text-white/68 transition-colors hover:text-white"

  const productLinks = [
    { href: "#about", label: dict.home.navAbout },
    { href: "#why-us", label: dict.home.navWhyUs },
    { href: "#faq", label: dict.home.navFaq },
  ]

  const docsLinks = [
    { href: GITHUB_REPO_URL, label: dict.home.footerGithub, external: true },
    { href: DOCS_URL, label: dict.home.footerDocsLink, external: true },
    { href: ADMIN_ROUTES.login, label: dict.home.navAdmin, external: false },
    { href: ADMIN_ROUTES.home, label: dict.home.footerDashboard, external: false },
  ]

  return (
    <footer className="relative bg-[#111] text-white">
      <div className="mx-auto max-w-[1440px] px-4 pt-[70px] pb-10 sm:px-6 lg:px-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div className="max-w-[328px]">
            <Link href={localizedPath(locale, "")} className="inline-block">
              <span className="font-heading text-[28px] leading-[1.2] tracking-[0.28em] text-white">
                {wordmark}
              </span>
            </Link>
            <p className="mt-[22px] text-base leading-[1.7] text-white/64">{dict.home.footerTagline}</p>
          </div>

          <div>
            <p className="text-base font-bold text-tiffany-blue">{dict.home.footerProduct}</p>
            <div className="mt-[23px] flex flex-col gap-[15px]">
              {productLinks.map((link) => (
                <a key={link.href} href={link.href} className={linkClassName}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-base font-bold text-tiffany-blue">{dict.home.footerDocs}</p>
            <div className="mt-[23px] flex flex-col gap-[15px]">
              {docsLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={linkClassName}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-sm text-white/45">
          {dict.home.footerCopyright}
        </p>
      </div>
    </footer>
  )
}
