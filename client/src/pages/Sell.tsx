import { ArrowLeft, Camera, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ValuationForm } from "@/components/ValuationForm";
import { trpc } from "@/lib/trpc";

export default function Sell() {
  const { data: config } = trpc.site.config.useQuery();
  return (
    <div className="site-shell sell-page">
      <SiteHeader />
      <main className="sell-main"><div className="container"><Link className="back-link" href="/"><ArrowLeft className="size-4" /> Volver al inicio</Link><div className="sell-layout"><aside className="sell-intro"><p className="eyebrow eyebrow-accent">Ventas & permutas</p><h1>¿QUERÉS<br />VENDER TU<br /><i>MOTO?</i></h1><p>Pasale los datos a ARRIETA y recibí una primera evaluación. Después seguimos por WhatsApp para hablar de la operación.</p><div className="sell-help"><Camera className="size-5" /><p>¿Tenés fotos? Podés enviarlas directamente cuando se abra el chat de WhatsApp.</p></div><div className="sell-help"><MessageCircle className="size-5" /><p>Cuanto más detalle nos pases, más fácil es orientarte.</p></div></aside><div className="sell-form-card"><ValuationForm config={config} /><p className="sell-form-bottom">* Campos obligatorios. Sin compromisos ni respuestas automáticas.</p></div></div></div></main>
      <SiteFooter config={config} />
    </div>
  );
}
