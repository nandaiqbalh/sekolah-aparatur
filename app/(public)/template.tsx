import { PageTransition } from "@/components/public/page-transition"

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
