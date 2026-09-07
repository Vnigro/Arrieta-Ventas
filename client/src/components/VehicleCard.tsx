import { ArrowUpRight, Gauge, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import type { Vehicle } from "../../../server/inventory";
import { formatARS, formatKm } from "@/lib/format";
import { VehicleStatus } from "./VehicleStatus";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const image = vehicle.images.find(image => image.isCover) ?? vehicle.images[0];
  const title = `${vehicle.brand} ${vehicle.model}`;

  return (
    <article className="vehicle-card group">
      <Link href={`/vehiculos/${vehicle.slug}`} className="vehicle-card-media" aria-label={`Ver ${title} ${vehicle.year}`}>
        {image ? (
          <img src={image.url} alt={image.alt} loading={priority ? "eager" : "lazy"} />
        ) : (
          <div className="vehicle-card-placeholder">Sin imagen</div>
        )}
        <div className="vehicle-card-shade" />
        <VehicleStatus status={vehicle.status} />
        <span className="card-open-icon" aria-hidden="true"><ArrowUpRight className="size-4" /></span>
      </Link>
      <div className="vehicle-card-content">
        <p className="eyebrow">{vehicle.type === "moto" ? "Moto" : vehicle.type === "auto" ? "Auto" : "Utilitario"} · {vehicle.year}</p>
        <div className="vehicle-card-title-row">
          <h3>{title}</h3>
          <span className="vehicle-year">{vehicle.year}</span>
        </div>
        <p className="vehicle-version">{vehicle.version ?? "Versión a consultar"}</p>
        <div className="vehicle-facts">
          <span><Gauge className="size-3.5" /> {formatKm(vehicle.mileage)}</span>
          {vehicle.acceptsTrade && <span><RotateCcw className="size-3.5" /> Permuta</span>}
        </div>
        <div className="vehicle-price-row">
          <span className="vehicle-price">{formatARS(vehicle.price)}</span>
          <Link href={`/vehiculos/${vehicle.slug}`} className="text-link">Ver ficha <ArrowUpRight className="size-3.5" /></Link>
        </div>
      </div>
    </article>
  );
}
