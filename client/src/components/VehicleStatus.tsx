import { Circle } from "lucide-react";
import type { Vehicle } from "../../../server/inventory";

const labels: Record<Vehicle["status"], string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
  permutado: "Permutado",
};

export function VehicleStatus({ status, className = "" }: { status: Vehicle["status"]; className?: string }) {
  return (
    <span className={`vehicle-status status-${status} ${className}`}>
      <Circle aria-hidden="true" className="size-2 fill-current" />
      {labels[status]}
    </span>
  );
}
