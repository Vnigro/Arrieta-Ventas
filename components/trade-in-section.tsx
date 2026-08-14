import { buttonVariants } from "@/components/ui/button"
import { ArrowLeftRight, Camera, FileCheck2, Bike } from "lucide-react"

export function TradeInSection() {
  // Número de WhatsApp (reemplazalo por el real)
  const whatsappNumber = "5492236694991" 
  const message = encodeURIComponent(
    "¡Hola Arrieta Ventas! Me interesa entregar mi moto en parte de pago. Les envío fotos y datos:"
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <section id="permutas" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Banner Principal */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
          
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Encabezado */}
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ArrowLeftRight className="size-3.5" />
                <span>Tomamos tu usada</span>
              </div>
              
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                ¿Querés cambiar tu moto o entregarla en parte de pago?
              </h2>
              
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Cotizamos tu vehículo de forma transparente y rápida. No te quedes a pie: venís con tu moto actual y te vas rodando en la nueva.
              </p>
            </div>

            {/* CTA Directo */}
            <div className="flex-shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  size: "lg",
                  className: "w-full sm:w-auto h-12 rounded-xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center",
                })}
              >
                Cotizar mi moto por WhatsApp
              </a>
            </div>
          </div>

          {/* Pasos del Proceso */}
          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border/60 pt-8 sm:grid-cols-3">
            
            <div className="flex items-start gap-3.5 rounded-2xl bg-secondary/50 p-4">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Camera className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">1. Mandanos fotos</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Escribinos por WhatsApp con fotos, año, km y estado de tu moto.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl bg-secondary/50 p-4">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileCheck2 className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">2. Cotización justa</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Evaluamos el valor de mercado y te pasamos nuestra mejor propuesta.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl bg-secondary/50 p-4">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bike className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">3. Hacé el cambio</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Coordinamos la entrega y transferencia para que te vayas manejando.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}