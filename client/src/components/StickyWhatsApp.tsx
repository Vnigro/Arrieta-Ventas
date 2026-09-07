import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function StickyWhatsApp({ message, phone }: { message: string; phone?: string | null }) {
  return <a className="sticky-whatsapp" href={getWhatsAppUrl(message, phone)} target="_blank" rel="noreferrer"><MessageCircle className="size-5" /> Consultar por WhatsApp</a>;
}
