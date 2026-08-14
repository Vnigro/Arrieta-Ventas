"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VehicleCard } from "@/components/vehicle-card"
import { VehicleDialog } from "@/components/vehicle-dialog"
import { vehicles, type Vehicle } from "@/lib/vehicles"
import { Search, SearchX } from "lucide-react"

type TypeFilter = "todas" | "moto" | "auto"
type StatusFilter = "todos" | "disponible" | "vendida"
type SortOrder = "destacados" | "precio-asc" | "precio-desc" | "anio-desc"

const STATUS_LABELS: Record<StatusFilter, string> = {
  todos: "Todos",
  disponible: "Disponibles",
  vendida: "Vendidas",
}

const SORT_LABELS: Record<SortOrder, string> = {
  destacados: "Destacados",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  "anio-desc": "Año: más nuevo",
}

export function CatalogSection() {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<TypeFilter>("todas")
  const [status, setStatus] = useState<StatusFilter>("todos")
  const [sort, setSort] = useState<SortOrder>("destacados")

  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [open, setOpen] = useState(false)

  function handleView(vehicle: Vehicle) {
    setSelected(vehicle)
    setOpen(true)
  }

const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = vehicles.filter((v) => {
      const matchesQuery =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)

      // Normalizamos a minúsculas y evaluamos si "moto" o "auto" está en v.type o v.category
      const vType = (v.type || "").toLowerCase()
      const vCategory = (v.category || "").toLowerCase()
      const matchesType =
        type === "todas" || vType === type || vCategory === type

      // Normalizamos el estado a minúsculas para evitar fallos por mayúsculas
      const vStatus = (v.status || "").toLowerCase()
      const matchesStatus =
        status === "todos" || vStatus === status

      return matchesQuery && matchesType && matchesStatus
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "precio-asc":
          return a.priceUsd - b.priceUsd
        case "precio-desc":
          return b.priceUsd - a.priceUsd
        case "anio-desc":
          return b.year - a.year
        default:
          // destacados: disponibles primero
          if (a.status.toLowerCase() !== b.status.toLowerCase()) {
            return a.status.toLowerCase() === "disponible" ? -1 : 1
          }
          return 0
      }
    })
    return list
  }, [query, type, status, sort])

  return (
    <section id="catalogo" className="scroll-mt-20 bg-secondary/40 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Catálogo de vehículos
          </h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} unidad{filtered.length === 1 ? "" : "es"}{" "}
            {filtered.length === 1 ? "encontrada" : "encontradas"}
          </p>
        </div>

        {/* Controles de filtro */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscá por modelo o marca (ej: Tornado, Titan, Golf)"
              className="h-11 pl-9"
              aria-label="Buscar vehículos"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={type}
              onValueChange={(v) => setType(v as TypeFilter)}
              className="w-full sm:w-auto"
            >
              <TabsList className="h-10 w-full sm:w-auto">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="moto">Motos</TabsTrigger>
                <TabsTrigger value="auto">Autos</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as StatusFilter)}
              >
                <SelectTrigger className="h-10 flex-1 sm:w-40" aria-label="Filtrar por estado">
                  <SelectValue>{STATUS_LABELS[status]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="disponible">Disponibles</SelectItem>
                  <SelectItem value="vendida">Vendidas</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sort}
                onValueChange={(v) => setSort(v as SortOrder)}
              >
                <SelectTrigger className="h-10 flex-1 sm:w-48" aria-label="Ordenar por">
                  <SelectValue>{SORT_LABELS[sort]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="destacados">Destacados</SelectItem>
                  <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
                  <SelectItem value="anio-desc">Año: más nuevo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grilla */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onViewDetails={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <SearchX className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No encontramos vehículos con esos filtros
            </p>
            <p className="text-sm text-muted-foreground">
              Probá con otra búsqueda o consultanos por WhatsApp.
            </p>
          </div>
        )}
      </div>

      <VehicleDialog vehicle={selected} open={open} onOpenChange={setOpen} />
    </section>
  )
}
