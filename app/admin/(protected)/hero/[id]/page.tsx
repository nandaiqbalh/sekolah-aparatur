import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { HeroSlideForm } from "@/features/hero/components/hero-slide-form"
import { heroSlideService } from "@/features/hero/services/hero-slide-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminHeroFormPage({ params }: PageProps) {
  const { id } = await params

  if (id === "baru") {
    if (!(await canAccessPage("hero.create"))) {
      return <AccessDenied />
    }
    return <HeroSlideForm mode="create" />
  }

  if (!UUID_PATTERN.test(id)) notFound()
  if (!(await canAccessPage("hero.update"))) {
    return <AccessDenied />
  }

  const slide = await heroSlideService.getById(id)
  if (!slide.ok || !slide.data) notFound()

  return <HeroSlideForm mode="edit" slide={slide.data} />
}
