"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import {
  buildWhatsAppLink,
  formatKm,
  formatPrice,
  type Vehicle,
} from "@/lib/vehicles"
import { Calendar, Gauge, Cog } from "lucide-react"
import { cn } from "@/lib/utils"

export function VehicleCard({
  vehicle,
  onViewDetails,
}: {
  vehicle: Vehicle
  onViewDetails: (vehicle: Vehicle) => void
}) {
  const sold = vehicle.status === "vendida"

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-foreground/5">
      <button
        type="button"
        onClick={() => onViewDetails(vehicle)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-muted text-left"
        aria-label={`Ver ficha de ${vehicle.title}`}
      >
        <img
          src={vehicle.images[0] || "/placeholder.svg"}
          alt={`${vehicle.title} ${vehicle.year}`}
          className={cn(
            "size-full object-cover transition-transform duration-300 group-hover:scale-105",
            sold && "opacity-60 grayscale",
          )}
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {sold ? (
            <Badge className="bg-foreground/85 text-background">VENDIDA</Badge>
          ) : (
            <Badge className="bg-success text-success-foreground">
              Disponible
            </Badge>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {vehicle.category}
          </Badge>
        </div>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-pretty text-base font-bold leading-tight text-foreground">
          {vehicle.title}
        </h3>

        <dl className="mt-3 grid grid-cols-3 gap-2 border-y border-border py-3 text-center">
          <Spec icon={<Calendar className="size-4" />} label="Año" value={String(vehicle.year)} />
          <Spec icon={<Gauge className="size-4" />} label="Kilómetros" value={formatKm(vehicle.km)} />
          <Spec icon={<Cog className="size-4" />} label="Motor" value={vehicle.engine} />
        </dl>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            {formatPrice(vehicle.priceUsd)}
          </span>
          <span className="text-xs font-medium text-muted-foreground">ARS</span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {sold ? (
            <Button variant="secondary" disabled className="h-11 w-full">
              Unidad vendida
            </Button>
          ) : (
            <Button
              className="h-11 w-full gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a]"
              render={
                <a
                  href={buildWhatsAppLink(vehicle)}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <WhatsAppIcon className="size-5" />
              Consultar por WhatsApp
            </Button>
          )}
          <Button
            variant="ghost"
            className="h-9 w-full"
            onClick={() => onViewDetails(vehicle)}
          >
            Ver ficha completa
          </Button>
        </div>
      </div>
    </article>
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
