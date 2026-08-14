import { MapPin, Clock, AtSign, Globe } from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { WHATSAPP_NUMBER } from "@/lib/vehicles"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              MEL ARRIETA
            </span>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Motos &amp; Autos
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Compra y venta de motos y autos seleccionados. Unidades al día y
              listas para transferir.
            </p>
          </div>

          <nav aria-label="Navegación del sitio">
            <h3 className="text-sm font-semibold text-foreground">Explorar</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#catalogo" className="hover:text-foreground">
                  Catálogo completo
                </a>
              </li>
              <li>
                <a href="#vender" className="hover:text-foreground">
                  Vendé tu vehículo
                </a>
              </li>
              <li>
                <a href="#top" className="hover:text-foreground">
                  Inicio
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Atención</h3>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>Chacabuco Provincia de Buenos Aires · Atención con turno</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>Lun a Sáb · 9:00 a 19:00 hs</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Seguinos</h3>
            <div className="mt-3 flex gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribinos por WhatsApp"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
              >
                <WhatsAppIcon className="size-4" />
              </a>
              <a
                href="https://www.instagram.com/melisaaaaj/"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
              >
                <AtSign className="size-4" />
              </a>
              <a
                href="#"
                aria-label="Sitio web"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
              >
                <Globe className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MEL ARRIETA Motos &amp; Autos. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  )
}
