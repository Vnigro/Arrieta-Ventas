import { ArrowRight, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import type { InventoryFilters as FilterState } from "../../../server/inventory";
import { InventoryFilters } from "@/components/InventoryFilters";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VehicleCard } from "@/components/VehicleCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { trpc } from "@/lib/trpc";

export default function Inventory() {
  const [filters, setFilters] = useState<FilterState>({ sort: "recientes" });
  const queryInput = useMemo(() => filters, [filters]);
  const { data: allVehicles = [] } = trpc.inventory.list.useQuery();
  const { data: vehicles, isLoading } = trpc.inventory.list.useQuery(queryInput);
  const { data: config } = trpc.site.config.useQuery();

  return (
    <div className="site-shell section-dark inventory-page">
      <SiteHeader />
      <main>
        <section className="inventory-hero"><div className="container"><p className="eyebrow eyebrow-accent">Stock actual · Chacabuco</p><h1>ENCONTRÁ<br />LO QUE <i>BUSCÁS.</i></h1><p>Filtrá el stock, mirá las fichas y preguntá directo por WhatsApp.</p></div></section>
        <section className="inventory-content"><div className="container"><InventoryFilters filters={filters} onChange={setFilters} vehicles={allVehicles} /> <div className="inventory-results-head"><p><strong>{isLoading ? "—" : vehicles?.length ?? 0}</strong> vehículos para mirar</p><span>Resultados actualizados</span></div>{isLoading ? <div className="stock-loading">Actualizando stock...</div> : vehicles?.length ? <div className="inventory-card-grid">{vehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="empty-state"><SearchX className="size-9" /><p className="eyebrow">No encontramos una coincidencia</p><h2>¿BUSCÁS ALGO<br /><i>EN PARTICULAR?</i></h2><p>También buscamos vehículos por pedido. Contanos qué necesitás y lo vemos.</p><WhatsAppButton dark phone={config?.whatsapp} message="Hola ARRIETA 👋 No encontré lo que buscaba en el stock. ¿Me ayudan a encontrar un vehículo?" label="Hablar por WhatsApp" /></div>}<Link href="/vender" className="request-strip"><span><b>¿Querés vender o permutar?</b> Cotizá tu vehículo con ARRIETA.</span><ArrowRight className="size-5" /></Link></div></section>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}
