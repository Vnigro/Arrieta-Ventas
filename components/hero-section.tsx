"use client"

import { Button } from "@/components/ui/button"
import { buildSellWhatsAppLink } from "@/lib/vehicles"
import { ArrowRight, ShieldCheck, Zap, FileCheck } from "lucide-react"

export function HeroSection() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:pt-16 sm:pb-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" />
          Nuestros vehiculos · Motos &amp; Autos
        </span>

        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Encontrá tu próximo vehiculo o vendé el tuyo{" "}
          <span className="text-brand">en el acto.</span>
        </h1>

        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Unidades seleccionadas, al día y listas para transferir. Tasación
          inmediata y atención directa por WhatsApp.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            className="h-12 justify-center gap-2 px-6 text-base"
            onClick={() => scrollTo("catalogo")}
          >
            Ver Catálogo Completo
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-12 justify-center gap-2 px-6 text-base"
            onClick={() => scrollTo("vender")}
          >
            Quiero Vender mi Vehículo
          </Button>
        </div>

        <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Feature
            icon={<FileCheck className="size-5 text-brand" />}
            title="Papeles al día"
            desc="Listas para transferir, sin sorpresas."
          />
          <Feature
            icon={<Zap className="size-5 text-brand" />}
            title="Compra Y venta"
            desc="Recibí el valor de tu vehículo en el día."
          />
          <Feature
            icon={<ShieldCheck className="size-5 text-brand" />}
            title="Transparencia total"
            desc="Cada unidad revisada y verificada."
          />
        </dl>
      </div>
    </section>
  )
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10">
        {icon}
      </div>
      <div>
        <dt className="text-sm font-semibold text-foreground">{title}</dt>
        <dd className="text-sm leading-relaxed text-muted-foreground">{desc}</dd>
      </div>
    </div>
  )
}
