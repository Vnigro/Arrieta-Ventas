import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { CatalogSection } from "@/components/catalog-section"
import { TradeInSection } from "@/components/trade-in-section" // <-- Importás el nuevo módulo
import { SellSection } from "@/components/sell-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <CatalogSection />
        <SellSection />
        <TradeInSection />
      </main>
      <SiteFooter />
    </div>
  )
}
