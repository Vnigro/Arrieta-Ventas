export type VehicleType = "moto" | "auto"
export type VehicleStatus = "disponible" | "vendida"

export interface Vehicle {
  id: string
  title: string
  brand: string
  type: "moto" | "auto"
  category: string
  status: "disponible" | "vendida"
  year: number
  km: number
  engine: string
  priceUsd: number
  images: string[]
  description: string
  highlights: string[]
}

/** Número de WhatsApp del negocio (formato internacional, sin +). */
export const WHATSAPP_NUMBER = "5492236694991"

export function formatPrice(priceUsd: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(priceUsd)
}

export function formatKm(km: number): string {
  return `${new Intl.NumberFormat("es-AR").format(km)} km`
}

/** Genera un link de WhatsApp con un mensaje dinámico para un vehículo. */
export function buildWhatsAppLink(vehicle: Vehicle): string {
  const message = `Hola Arrieta! Estoy interesado/a en la ${vehicle.title} ${vehicle.year} (${formatPrice(
    vehicle.priceUsd,
  )}) que vi en la web.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/** Link de WhatsApp para vender / tasar un vehículo. */
export function buildSellWhatsAppLink(): string {
  const message =
    "Hola Arrieta! Quiero vender/tasar mi vehículo. Les paso los datos y fotos."
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const vehicles: Vehicle[] = [
  {
    id: "xr250-tornado",
    title: "Honda XR 250 Tornado",
    brand: "Honda",
    type: "moto",
    category: "Enduro",
    status: "disponible",
    year: 2016,
    km: 21000,
    engine: "250cc",
    priceUsd: 6300000,
    images: ["/tornado250.jpg"],
    description:
      "Impecable XR 250 Tornado, la enduro más buscada del mercado. Papeles al día y lista para transferir. Ideal para ciudad y ruta liviana.",
    highlights: ["Papeles al día, lista para transferir"],
  },
  {
    id: "cg150-titan",
    title: "Honda CG 150 Titan",
    brand: "Honda",
    type: "moto",
    category: "Street",
    status: "disponible",
    year: 2019,
    km: 28000,
    engine: "150cc",
    priceUsd: 4000000,
    images: ["/titan-blue.jpg"],
    description:
      "Titan 150 en excelente estado, la elección número uno para el día a día por su bajo consumo y confiabilidad. Mantenimiento al día.",
    highlights: [
      "Bajo consumo",
      "Service al día"
    ],
  },
  {
    id: "xtz-125",
    title: "Yamaha XTZ 125",
    brand: "Yamaha",
    type: "moto",
    category: "Enduro",
    status: "vendida",
    year: 2021,
    km: 18500,
    engine: "125cc",
    priceUsd: 0,
    images: ["/xtz-black.jpg"],
    description:
      "Trail de media cilindrada ideal para el uso diario y salidas de fin de semana. Muy cómoda y ágil.",
    highlights: [
      "Cubiertas mixtas nuevas",
      "Mantenimiento al día",
      "Papeles en regla",
    ],
  },
  {
    id: "dax-70",
    title: "Gilera Dax 70",
    brand: "Gilera",
    type: "moto",
    category: "Street",
    status: "vendida",
    year: 2023,
    km: 3200,
    engine: "70cc",
    priceUsd: 0,
    images: ["/dax-black.jpg"],
    description:
      "Modelo clásico, súper práctico y económico para moverse en la ciudad.",
    highlights: [
      "Excelente estado",
      "Ideal ciudad",
      "Bajo consumo",
    ],
  },
  {
    id: "mondial-max-110",
    title: "Mondial Max 110",
    brand: "Mondial",
    type: "moto",
    category: "Street",
    status: "disponible",
    year: 2024,
    km: 6000,
    engine: "110cc",
    priceUsd: 1200000,
    images: ["/mondial-max110.jpg"],
    description:
      "Moto de trabajo/urbana muy económica, service completo recién realizado.",
    highlights: [
      "Service recien hecho",
      "Papeles al día",
    ],
  },
  {
    id: "titan-red-2022",
    title: "Honda New Titan 150cc",
    brand: "Honda",
    type: "moto",
    category: "Street",
    status: "vendida",
    year: 2022,
    km: 7400,
    engine: "150cc",
    priceUsd: 0,
    images: ["/titan-red.jpg"],
    description:
      "Naked deportiva ágil y divertida, perfecta para el uso diario. Muy liviana y con gran frenada.",
    highlights: [
      "Tablero digital",
      "Cubiertas al 90%",
      "Papeles al día",
    ],
  },
  {
    id: "titan-white-2022",
    title: "Honda New Titan 150cc",
    brand: "Honda",
    type: "moto",
    category: "Street",
    status: "vendida",
    year: 2022,
    km: 7400,
    engine: "150cc",
    priceUsd: 0,
    images: ["/titan-white.jpg"],
    description:
      "Naked deportiva ágil y divertida, excelente estado general.",
    highlights: [
      "Tablero digital",
      "Cubiertas al 90%",
      "Papeles al día",
    ],
  },
  {
    id: "titan-red-2019",
    title: "Honda New Titan 150cc",
    brand: "Honda",
    type: "moto",
    category: "Street",
    status: "vendida",
    year: 2019,
    km: 68000,
    engine: "150cc",
    priceUsd: 0,
    images: ["/titan-redTWo.jpg"],
    description:
      "Honda New Titan 150cc en muy buen estado de conservación. Ideal para transporte urbano diario.",
    highlights: [
      "Service al día",
      "Tapizados e instrumentos impecables",
      "Título y VTV al día",
    ],
  },
]