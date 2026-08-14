"use client"

import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { buildSellWhatsAppLink } from "@/lib/vehicles"
import { Camera, Calculator, Banknote } from "lucide-react"

const steps = [
  {
    icon: Camera,
    title: "Enviános fotos y datos",
    desc: "Mandanos fotos y la info de tu moto o auto por WhatsApp. Rápido y sin vueltas.",
  },
  {
    icon: Calculator,
    title: "Recibí la cotización en el día",
    desc: "Pasanos tu vehiculo e informacion del mismo y te decimos cuanto lo cotizamos.",
  },
  {
    icon: Banknote,
    title: "Cobrás al instante",
    desc: "Cobrás en el acto o la dejamos en consignación. Vos elegís.",
  },
]

export function SellSection() {
  return (
    <section id="vender" className="scroll-mt-20 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand">
              Vendé con Arrieta
            </span>
            <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight sm:text-4xl">
              Vendé tu moto o auto en 3 simples pasos
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-primary-foreground/70">
              Nos encargamos de todo para que vendas rápido, seguro y al mejor
              precio. Tasación transparente y pago inmediato.
            </p>
          </div>

          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                    <step.icon className="size-5" />
                  </span>
                  <span className="text-sm font-bold text-brand">
                    Paso {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-primary-foreground/70">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Button
              className="h-auto min-h-12 w-full sm:w-auto gap-2 bg-[#25D366] px-4 sm:px-6 py-3 text-sm sm:text-base text-white hover:bg-[#20bd5a] whitespace-normal leading-snug text-center"
              render={
                <a
                  href={buildSellWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <WhatsAppIcon className="size-5 shrink-0" />
              <span>Enviar datos de mi vehículo por WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
