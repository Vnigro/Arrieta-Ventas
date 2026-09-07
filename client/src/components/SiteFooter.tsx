import { ArrowUpRight, Instagram, MapPin, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import type { PublicSiteConfig } from "../../../server/inventory";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter({ config }: { config?: PublicSiteConfig }) {
  const socialHref = config?.instagram || "#contacto";
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <p className="footer-kicker">¿Estás a un mensaje de encontrarla?</p>
          <h2>HABLEMOS<br />DE TU PRÓXIMO<br /><i>VEHÍCULO.</i></h2>
        </div>
        <a className="footer-round-link" href={getWhatsAppUrl("Hola ARRIETA 👋 Quería hacer una consulta.", config?.whatsapp)} target="_blank" rel="noreferrer" aria-label="Hablar con ARRIETA por WhatsApp"><MessageCircle className="size-6" /><ArrowUpRight className="size-5" /></a>
      </div>
      <div className="container footer-bottom">
        <div className="footer-brand"><span>ARRIETA</span><small>AUTOS & MOTOS</small></div>
        <div className="footer-location"><MapPin className="size-4" /> {config?.location ?? "Chacabuco · Buenos Aires"}</div>
        <div className="footer-links">
          <Link href="/vehiculos">Stock</Link>
          <Link href="/vender">Vendé tu moto</Link>
          <a href={socialHref} target={config?.instagram ? "_blank" : undefined} rel="noreferrer"><Instagram className="size-4" /> Instagram</a>
        </div>
        <p className="footer-credit">Desarrollado por <a href="https://vnigro-studio.vercel.app/" target="_blank">Vnigro Studio</a></p>
      </div>
    </footer>
  );
}
