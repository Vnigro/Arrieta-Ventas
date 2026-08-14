"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import {
  buildWhatsAppLink,
  formatKm,
  formatPrice,
  type Vehicle,
} from "@/lib/vehicles"
import { Calendar, Gauge, Cog, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function VehicleDialog({
  vehicle,
  open,
  onOpenChange,
}: {
  vehicle: Vehicle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!vehicle) return null
  const sold = vehicle.status === "vendida"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex! max-h-[90vh] flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-xl bg-muted">
          <img
            src={vehicle.images[0] || "/placeholder.svg"}
            alt={`${vehicle.title} ${vehicle.year}`}
            className={cn("size-full object-cover", sold && "opacity-70 grayscale")}
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {sold ? (
              <Badge className="bg-foreground/85 text-background">VENDIDA</Badge>
            ) : (
              <Badge className="bg-success text-success-foreground">
                Disponible
              </Badge>
            )}
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              {vehicle.category}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold tracking-tight">
              {vehicle.title}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {vehicle.brand} · {vehicle.type === "moto" ? "Moto" : "Auto"} ·{" "}
              {vehicle.category}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {formatPrice(vehicle.priceUsd)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">USD</span>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/40 p-3 text-center">
            <Spec icon={<Calendar className="size-4" />} label="Año" value={String(vehicle.year)} />
            <Spec icon={<Gauge className="size-4" />} label="Kilómetros" value={formatKm(vehicle.km)} />
            <Spec icon={<Cog className="size-4" />} label="Motor" value={vehicle.engine} />
          </dl>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {vehicle.description}
          </p>

          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {vehicle.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                  <Check className="size-3 text-success" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {sold ? (
              <Button variant="secondary" disabled className="h-12 w-full text-base">
                Unidad vendida
              </Button>
            ) : (
              <Button
                className="h-12 w-full gap-2 bg-[#25D366] text-base text-white hover:bg-[#20bd5a]"
                render={
                  <a
                    href={buildWhatsAppLink(vehicle)}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <WhatsAppIcon className="size-5" />
                Consultar esta unidad por WhatsApp
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  )
}
