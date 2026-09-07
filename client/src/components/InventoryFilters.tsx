import { Search, SlidersHorizontal, X } from "lucide-react";
import type { InventoryFilters as Filters, InventorySort, InventoryStatus, InventoryType, Vehicle } from "../../../server/inventory";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  vehicles: Vehicle[];
  compact?: boolean;
};

const types: Array<{ value: InventoryType | undefined; label: string }> = [
  { value: undefined, label: "Todo" }, { value: "moto", label: "Motos" }, { value: "auto", label: "Autos" }, { value: "utilitario", label: "Utilitarios" },
];

export function InventoryFilters({ filters, onChange, vehicles, compact = false }: Props) {
  const brands = Array.from(new Set(vehicles.map(vehicle => vehicle.brand))).sort();
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value || undefined });
  const hasFilters = Boolean(filters.type || filters.brand || filters.status || filters.query || filters.acceptsTrade);

  return (
    <section className={`inventory-filters ${compact ? "inventory-filters-compact" : ""}`} aria-label="Filtros de vehículos">
      <div className="filter-search">
        <Search className="size-4" aria-hidden="true" />
        <input aria-label="Buscar marca o modelo" value={filters.query ?? ""} placeholder="Buscá marca o modelo" onChange={event => update("query", event.target.value)} />
      </div>
      <div className="filter-type-row" role="group" aria-label="Tipo de vehículo">
        {types.map(type => <button key={type.label} className={filters.type === type.value ? "is-selected" : ""} onClick={() => update("type", type.value)}>{type.label}</button>)}
      </div>
      {!compact && <div className="filter-select-row">
        <label><span>Marca</span><select value={filters.brand ?? ""} onChange={event => update("brand", event.target.value)}><option value="">Todas</option>{brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}</select></label>
        <label><span>Estado</span><select value={filters.status ?? ""} onChange={event => update("status", event.target.value as InventoryStatus)}><option value="">Todos</option><option value="disponible">Disponible</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option><option value="permutado">Permutado</option></select></label>
        <label><span>Ordenar</span><select value={filters.sort ?? "recientes"} onChange={event => update("sort", event.target.value as InventorySort)}><option value="recientes">Más recientes</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option><option value="anio-desc">Año más nuevo</option><option value="km-asc">Menos kilómetros</option></select></label>
        <button className={`trade-filter ${filters.acceptsTrade ? "is-selected" : ""}`} onClick={() => update("acceptsTrade", filters.acceptsTrade ? undefined : true)}><SlidersHorizontal className="size-4" /> Acepta permuta</button>
      </div>}
      {hasFilters && <button className="clear-filters" onClick={() => onChange({ sort: "recientes" })}><X className="size-3.5" /> Limpiar filtros</button>}
    </section>
  );
}
