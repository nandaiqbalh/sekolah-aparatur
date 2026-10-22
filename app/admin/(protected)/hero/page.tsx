import { AccessDenied } from "@/components/admin/access-denied"
import { HeroSlidesManager } from "@/features/hero/components/hero-slides-manager"
import { heroSlideService } from "@/features/hero/services/hero-slide-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

export default async function AdminHeroPage() {
  if (!(await canAccessPage("hero.view"))) {
    return <AccessDenied />
  }

  const slides = await heroSlideService.list()

  return <HeroSlidesManager initialSlides={slides.ok && slides.data ? slides.data : []} />
}
