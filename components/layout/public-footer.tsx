import { Mail } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { WhatsAppIcon } from "@/components/public/whatsapp-button"
import { getSiteContact } from "@/features/kontak/services/site-contact-service"
import type { SocialPlatform } from "@/features/kontak/schemas/site-contact"
import Image from "next/image"
import Link from "next/link"

import { ROUTES } from "@/lib/routes"
import { whatsappHref } from "@/lib/site-contact"

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M14.5 8.5V6.8c0-.7.5-1.3 1.2-1.3H17V3h-2.1C12.4 3 11 4.5 11 6.6v1.9H9v2.6h2V21h3.5v-9.9h2.3l.4-2.6h-2.7Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M14.5 3c.4 2.4 1.8 4.1 4.2 4.4v2.4c-1.4 0-2.7-.4-4-1.2v6.7c0 3.3-2.5 5.7-5.8 5.7S3 18.6 3 15.3c0-3.2 2.5-5.6 5.7-5.7v2.5c-1.7.1-3 1.5-3 3.2 0 1.8 1.4 3.2 3.2 3.2s3.1-1.4 3.1-3.2V3h2.5Z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM10 15.5v-6.6l5.2 3.3-5.2 3.3Z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M14.7 10.3 21.4 3h-1.6l-5.8 6.4L9.2 3H3.5l7 9.8L3.5 21h1.6l6.1-6.8L15.4 21h5.7l-7.4-10.7Zm-2.2 2.4-.7-.9-5.6-7.6h2.4l4.5 6.1.7.9 5.9 8h-2.4l-4.8-6.5Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M5.7 8.7H2.9V21h2.8V8.7ZM4.3 3C3.3 3 2.5 3.8 2.5 4.8S3.3 6.6 4.3 6.6 6.1 5.8 6.1 4.8 5.3 3 4.3 3ZM21.1 21h-2.8v-6.4c0-1.8-.7-2.4-1.7-2.4s-2 .9-2 2.5V21H11.8V8.7h2.7v1.7c.5-.9 1.7-1.9 3.5-1.9 2.3 0 4.1 1.5 4.1 4.8V21Z" />
    </svg>
  )
}

const socialLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram LPSDM Aparatur",
  facebook: "Facebook LPSDM Aparatur",
  tiktok: "TikTok LPSDM Aparatur",
  youtube: "YouTube LPSDM Aparatur",
  x: "X LPSDM Aparatur",
  linkedin: "LinkedIn LPSDM Aparatur",
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "facebook") return <FacebookIcon />
  if (platform === "tiktok") return <TikTokIcon />
  if (platform === "youtube") return <YouTubeIcon />
  if (platform === "x") return <XIcon />
  if (platform === "linkedin") return <LinkedInIcon />
  return <InstagramIcon />
}

const links = [
  { href: ROUTES.profil, label: "Profil" },
  { href: ROUTES.sekolahAparatur, label: "Program" },
  { href: ROUTES.berita, label: "Informasi" },
  { href: ROUTES.galeri, label: "Galeri" },
  { href: ROUTES.kontak, label: "Kontak" },
]

const iconClassName =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"

export async function PublicFooter() {
  const contact = await getSiteContact()
  const year = new Date().getFullYear()
  const whatsapp = whatsappHref(
    contact?.whatsappNumber,
    "Yth. Panitia LPSDM Aparatur, saya ingin menanyakan informasi program Sekolah Aparatur.",
  )
  const socials = [
    ...(contact?.email
      ? [{ href: `mailto:${contact.email}`, label: `Surel ${contact.email}`, external: false, icon: <Mail className="size-4" /> }]
      : []),
    ...(whatsapp
      ? [{ href: whatsapp, label: "WhatsApp panitia", external: true, icon: <WhatsAppIcon /> }]
      : []),
    ...(contact?.socials ?? []).map((item) => ({
      href: item.url,
      label: socialLabels[item.platform],
      external: true,
      icon: <SocialIcon platform={item.platform} />,
    })),
  ]

  return (
    <Reveal>
    <footer className="bg-[var(--sa-navy)] text-white">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,0.55fr)] lg:gap-x-10 lg:px-8">
        <div className="min-w-0">
          <Link
            href={ROUTES.home}
            className="relative block size-20 shrink-0 cursor-pointer"
          >
            <Image
              src="/brand/logo-lpsdm.webp"
              alt="LPSDM Aparatur"
              fill
              sizes="80px"
              className="object-contain"
            />
          </Link>
          <p className="mt-4 text-sm leading-6 text-white/70">
            LPSDM sebagai fasilitator Program Sekolah Aparatur.
          </p>
          {contact?.address ? <p className="mt-2 text-sm leading-6 text-white/70">{contact.address}</p> : null}
        </div>

        <nav className="min-w-0" aria-label="Footer">
          <p className="text-sm font-semibold">Navigasi</p>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-sm marker:text-white/40">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="cursor-pointer text-white/70 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <p className="text-sm font-semibold">Ikuti Kami</p>
          <ul className="mt-3 flex w-fit gap-3">
            {socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className={iconClassName}
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/45">
        © {year} LPSDM Aparatur. All rights reserved.
      </p>
    </footer>
    </Reveal>
  )
}
