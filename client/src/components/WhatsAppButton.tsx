import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  message: string;
  phone?: string | null;
  label?: string;
  className?: string;
  dark?: boolean;
};

export function WhatsAppButton({ message, phone, label = "Consultar por WhatsApp", className = "", dark = false }: WhatsAppButtonProps) {
  return (
    <a
      className={`wa-button ${dark ? "wa-button-dark" : ""} ${className}`}
      href={getWhatsAppUrl(message, phone)}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label}. Abre WhatsApp.`}
    >
      <MessageCircle aria-hidden="true" className="size-[1.08rem]" />
      <span>{label}</span>
    </a>
  );
}
