"use client"

import { Button } from "@/components/ui/button"
import { buildSellWhatsAppLink } from "@/lib/vehicles"
import { Search, TrendingUp } from "lucide-react"

export function SiteHeader() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <a
          href="#top"
          className="flex flex-col leading-none"
          aria-label="MEL ARRIETA Motos & Autos, inicio"
        >
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            ARRIETA AUTOMOTORES
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Motos &amp; Autos · Compra y Venta
          </span>
        </a>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Buscar vehículos"
            onClick={() => scrollTo("catalogo")}
          >
            <Search />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => scrollTo("catalogo")}
          >
            <Search />
            Buscar
          </Button>

          <Button
            size="sm"
            className="h-9 gap-1.5 bg-brand px-3 text-brand-foreground hover:bg-brand/90"
            render={<a href={buildSellWhatsAppLink()} target="_blank" rel="noopener noreferrer" />}
          >
            <TrendingUp className="size-4" />
            <span className="hidden sm:inline">Vendé tu Vehiculo</span>
            <span className="sm:hidden">Vendé</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
