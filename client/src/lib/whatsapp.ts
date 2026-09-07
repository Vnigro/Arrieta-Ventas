const DEFAULT_PHONE = "+5492236694991"; // 👈 Numero del dueño. código de país (sin + ni espacios)

export function getWhatsAppUrl(message: string, phone?: string | null) {
  // 1. Limpiamos cualquier cosa recibida dejando solo números
  let cleanNumber = (phone ?? "").replace(/\D/g, "");

  // 2. Si no vino teléfono o quedó vacío, usamos SIEMPRE el DEFAULT_PHONE
  if (!cleanNumber) {
    cleanNumber = DEFAULT_PHONE.replace(/\D/g, "");
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

export function openWhatsApp(message: string, phone?: string | null) {
  // Abre WhatsApp en una pestaña nueva/app sin pisar tu web
  window.open(getWhatsAppUrl(message, phone), "_blank", "noopener,noreferrer");
}