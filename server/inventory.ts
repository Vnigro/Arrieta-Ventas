import type { VehicleRow } from "../drizzle/schema";

export type InventoryType = "moto" | "auto" | "utilitario";
export type InventoryStatus = "disponible" | "reservado" | "vendido" | "permutado";
export type InventorySort = "recientes" | "precio-asc" | "precio-desc" | "anio-desc" | "km-asc";

export type VehicleImage = {
  id: number;
  url: string;
  alt: string;
  sortOrder: number;
  isCover: boolean;
};

export type Vehicle = {
  id: number;
  slug: string;
  type: InventoryType;
  brand: string;
  model: string;
  version?: string | null;
  year: number;
  mileage?: number | null;
  engineCc?: number | null;
  fuel?: string | null;
  transmission?: string | null;
  price?: number | null;
  priceNote?: string | null;
  status: InventoryStatus;
  acceptsTrade: boolean;
  description?: string | null;
  conditionSummary?: string | null;
  documentation?: string | null;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  images: VehicleImage[];
};

export type InventoryFilters = {
  type?: InventoryType;
  brand?: string;
  status?: InventoryStatus;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  acceptsTrade?: boolean;
  sort?: InventorySort;
};

export type PublicSiteConfig = {
  businessName: string;
  location: string;
  whatsapp: string;
  instagram: string;
  openingHours: string;
  address: string;
  email: string;
  heroTitle: string;
  heroSubtitle: string;
  defaultWhatsappMessage: string;
  permutaEnabled: boolean;
  sellVehicleEnabled: boolean;
};

export const defaultSiteConfig: PublicSiteConfig = {
  businessName: "ARRIETA AUTOS & MOTOS",
  location: "Chacabuco · Buenos Aires",
  whatsapp: "",
  instagram: "",
  openingHours: "Consultanos por WhatsApp",
  address: "Chacabuco, Buenos Aires",
  email: "",
  heroTitle: "TU PRÓXIMA MOTO ARRANCA ACÁ.",
  heroSubtitle: "Stock real, atención directa y una forma más simple de comprar, vender o permutar.",
  defaultWhatsappMessage: "Hola ARRIETA 👋 Quería hacer una consulta.",
  permutaEnabled: true,
  sellVehicleEnabled: true,
};

const image = (id: number, url: string, alt: string): VehicleImage => ({
  id,
  url,
  alt,
  sortOrder: 0,
  isCover: true,
});

export const defaultVehicles: Vehicle[] = [
  {
    id: -1,
    slug: "honda-wave-2023",
    type: "moto",
    brand: "Honda",
    model: "Wave",
    version: "110",
    year: 2023,
    mileage: 12500,
    engineCc: 110,
    fuel: "Nafta",
    transmission: "Automática",
    price: 2250000,
    priceNote: "Precio orientativo. Consultanos por valor y condiciones actuales.",
    status: "disponible",
    acceptsTrade: true,
    description: "Una urbana ágil para moverte todos los días. Consultanos para conocer su estado real y coordinar una visita.",
    conditionSummary: "Información de estado a completar durante la revisión presencial.",
    documentation: "Estado de papeles y transferencia a confirmar con ARRIETA.",
    featured: true,
    published: true,
    createdAt: new Date("2026-09-01T12:00:00Z"),
    images: [image(-11, "/manus-storage/arrieta-wave-hero_80845cf5.jpg", "Honda Wave 2023 en una calle urbana")],
  },
  {
    id: -2,
    slug: "honda-titan-150",
    type: "moto",
    brand: "Honda",
    model: "Titan",
    version: "150cc",
    year: 2020,
    mileage: 28400,
    engineCc: 150,
    fuel: "Nafta",
    transmission: "Manual",
    price: 2950000,
    priceNote: "Precio orientativo. Consultanos por valor y condiciones actuales.",
    status: "disponible",
    acceptsTrade: true,
    description: "Una moto versátil para el día a día. Escribinos para ver fotos, consultar detalles y coordinar una visita.",
    conditionSummary: "Información de estado a completar durante la revisión presencial.",
    documentation: "Estado de papeles y transferencia a confirmar con ARRIETA.",
    featured: true,
    published: true,
    createdAt: new Date("2026-08-27T12:00:00Z"),
    images: [image(-21, "/manus-storage/arrieta-titan-hero_87230ee5.jpg", "Honda Titan 150 sobre un frente urbano")],
  },
  {
    id: -3,
    slug: "peugeot-207-2004",
    type: "auto",
    brand: "Peugeot",
    model: "207",
    version: null,
    year: 2004,
    mileage: 168000,
    engineCc: null,
    fuel: "Nafta",
    transmission: "Manual",
    price: 5400000,
    priceNote: "Precio orientativo. Consultanos por valor y condiciones actuales.",
    status: "disponible",
    acceptsTrade: false,
    description: "Un compacto para quienes buscan resolver movilidad con información clara y una atención directa.",
    conditionSummary: "Información de estado a completar durante la revisión presencial.",
    documentation: "Estado de papeles y transferencia a confirmar con ARRIETA.",
    featured: false,
    published: true,
    createdAt: new Date("2026-08-18T12:00:00Z"),
    images: [image(-31, "/manus-storage/arrieta-peugeot-hero_3213c64f.jpg", "Peugeot 207 en un entorno urbano")],
  },
];

export function vehicleFromRow(row: VehicleRow, images: VehicleImage[] = []): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    brand: row.brand,
    model: row.model,
    version: row.version,
    year: row.year,
    mileage: row.mileage,
    engineCc: row.engineCc,
    fuel: row.fuel,
    transmission: row.transmission,
    price: row.price,
    priceNote: row.priceNote,
    status: row.status,
    acceptsTrade: row.acceptsTrade === 1,
    description: row.description,
    conditionSummary: row.conditionSummary,
    documentation: row.documentation,
    featured: row.featured === 1,
    published: row.published === 1,
    createdAt: row.createdAt,
    images,
  };
}

export function filterVehicles(source: Vehicle[], filters: InventoryFilters = {}): Vehicle[] {
  const normalizedQuery = filters.query?.trim().toLocaleLowerCase("es-AR");
  const filtered = source.filter(vehicle => {
    if (!vehicle.published) return false;
    if (filters.type && vehicle.type !== filters.type) return false;
    if (filters.brand && vehicle.brand.toLocaleLowerCase("es-AR") !== filters.brand.toLocaleLowerCase("es-AR")) return false;
    if (filters.status && vehicle.status !== filters.status) return false;
    if (filters.acceptsTrade !== undefined && vehicle.acceptsTrade !== filters.acceptsTrade) return false;
    if (filters.minPrice !== undefined && (vehicle.price ?? 0) < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && (vehicle.price ?? Number.MAX_SAFE_INTEGER) > filters.maxPrice) return false;
    if (filters.minYear !== undefined && vehicle.year < filters.minYear) return false;
    if (filters.maxYear !== undefined && vehicle.year > filters.maxYear) return false;
    if (normalizedQuery) {
      const searchable = `${vehicle.brand} ${vehicle.model} ${vehicle.version ?? ""} ${vehicle.type}`.toLocaleLowerCase("es-AR");
      if (!searchable.includes(normalizedQuery)) return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "precio-asc": return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      case "precio-desc": return (b.price ?? 0) - (a.price ?? 0);
      case "anio-desc": return b.year - a.year;
      case "km-asc": return (a.mileage ?? Number.MAX_SAFE_INTEGER) - (b.mileage ?? Number.MAX_SAFE_INTEGER);
      default: return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
}

export function getVehicleBySlug(source: Vehicle[], slug: string) {
  return source.find(vehicle => vehicle.slug === slug && vehicle.published);
}

export function buildVehicleWhatsAppMessage(vehicle: Vehicle) {
  const price = vehicle.price ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(vehicle.price) : "a consultar";
  return `Hola ARRIETA 👋 Vi la ${vehicle.brand} ${vehicle.model} ${vehicle.year} en la web. Quería consultar si sigue ${vehicle.status}. Referencia: ${vehicle.slug}. Precio publicado: ${price}.`;
}
