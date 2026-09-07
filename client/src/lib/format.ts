export function formatARS(value?: number | null) {
  if (!value) return "Consultar";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value?: number | null) {
  if (value === null || value === undefined) return "A consultar";
  return `${new Intl.NumberFormat("es-AR").format(value)} km`;
}
