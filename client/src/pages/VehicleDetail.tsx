import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Expand, FileText, Gauge, MapPin, MessageCircle, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { VehicleInquiryForm } from "@/components/VehicleInquiryForm";
import { VehicleStatus } from "@/components/VehicleStatus";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { formatARS, formatKm } from "@/lib/format";
import { trpc } from "@/lib/trpc";
import { getWhatsAppUrl } from "@/lib/whatsapp";

function DetailGallery({ images, title }: { images: Array<{ id: number; url: string; alt: string }>; title: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!api) return;
    const select = () => setSelected(api.selectedScrollSnap());
    select();
    api.on("select", select);
    return () => {
      api.off("select", select);
    };
  }, [api]);

  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setExpanded(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [expanded]);

  const current = images[selected] ?? images[0];
  if (!images.length) return <div className="detail-no-image">Próximamente fotos del vehículo.</div>;

  return <>
    <div className="detail-gallery">
      <Carousel setApi={setApi} opts={{ loop: images.length > 1 }}>
        <CarouselContent>
          {images.map((item, index) => <CarouselItem key={item.id}>
            <button className="detail-main-image" type="button" onClick={() => setExpanded(true)} aria-label={`Ampliar imagen ${index + 1} de ${title}`}>
              <img src={item.url} alt={item.alt} />
              <span className="gallery-expand"><Expand className="size-4" /> Ampliar</span>
            </button>
          </CarouselItem>)}
        </CarouselContent>
      </Carousel>
      {images.length > 1 && <>
        <button className="gallery-nav gallery-prev" type="button" onClick={() => api?.scrollPrev()} aria-label="Foto anterior"><ChevronLeft className="size-5" /></button>
        <button className="gallery-nav gallery-next" type="button" onClick={() => api?.scrollNext()} aria-label="Foto siguiente"><ChevronRight className="size-5" /></button>
      </>}
      <span className="gallery-counter">{String(selected + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
    </div>
    {images.length > 1 && <div className="gallery-thumbnails" aria-label="Miniaturas de fotos">
      {images.map((item, index) => <button type="button" key={item.id} className={selected === index ? "is-active" : ""} onClick={() => api?.scrollTo(index)} aria-label={`Ver foto ${index + 1}`}><img src={item.url} alt="" /></button>)}
    </div>}
    {expanded && current && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`Imagen ampliada de ${title}`}>
      <button type="button" className="gallery-close" onClick={() => setExpanded(false)}><X className="size-5" /><span className="sr-only">Cerrar imagen ampliada</span></button>
      <img src={current.url} alt={current.alt} />
    </div>}
  </>;
}

export default function VehicleDetail() {
  const [, params] = useRoute("/vehiculos/:slug");
  const slug = params?.slug ?? "";
  const { data: vehicle, isLoading } = trpc.inventory.bySlug.useQuery({ slug }, { enabled: Boolean(slug) });
  const { data: config } = trpc.site.config.useQuery();

  if (isLoading) return <div className="site-shell section-dark min-h-screen"><SiteHeader /><main className="detail-loading">Cargando ficha del vehículo...</main></div>;
  if (!vehicle) return <div className="site-shell section-dark min-h-screen"><SiteHeader /><main className="detail-loading"><p className="eyebrow eyebrow-accent">Vehículo no encontrado</p><h1>ESTA FICHA NO<br /><i>ESTÁ DISPONIBLE.</i></h1><Link href="/vehiculos" className="primary-button">Volver al stock <ArrowRight className="size-4" /></Link></main></div>;

  const title = `${vehicle.brand} ${vehicle.model}`;
  const message = `Hola ARRIETA 👋 Vi la ${title} ${vehicle.year} en la web y quería consultar si sigue disponible. Referencia: ${vehicle.slug}. Precio publicado: ${formatARS(vehicle.price)}.`;
  const sold = vehicle.status === "vendido" || vehicle.status === "permutado";
  const specifications = [
    { label: "Año", value: vehicle.year },
    { label: "Kilómetros", value: formatKm(vehicle.mileage) },
    { label: "Cilindrada", value: vehicle.engineCc ? `${vehicle.engineCc} cc` : "No corresponde" },
    { label: "Combustible", value: vehicle.fuel ?? "A consultar" },
    { label: "Transmisión", value: vehicle.transmission ?? "A consultar" },
    { label: "Ubicación", value: config?.location ?? "Chacabuco · Buenos Aires" },
  ];

  return <div className="site-shell detail-page">
    <SiteHeader />
    <main>
      <div className="container detail-back-wrap"><Link href="/vehiculos" className="back-link"><ArrowLeft className="size-4" /> Volver al stock</Link></div>
      <section className="container detail-layout">
        <div className="detail-left"><DetailGallery images={vehicle.images} title={title} /></div>
        <div className="detail-summary">
          <div className="detail-topline"><VehicleStatus status={vehicle.status} /><span className="detail-stock-ref">REF. {vehicle.slug.slice(-4).toUpperCase()}</span></div>
          <p className="eyebrow">{vehicle.type === "moto" ? "Moto" : vehicle.type === "auto" ? "Auto" : "Utilitario"} · {vehicle.year}</p>
          <h1>{title}<em>{vehicle.version ?? ""}</em></h1>
          <p className="detail-price">{formatARS(vehicle.price)}</p>
          <p className="detail-price-note">{vehicle.priceNote ?? "Consultanos por precio y condiciones."}</p>
          {sold ? <Link href="/vehiculos" className="primary-button">Ver vehículos similares <ArrowRight className="size-4" /></Link> : <WhatsAppButton message={message} phone={config?.whatsapp} label="Consultar por WhatsApp" dark />}
          {vehicle.acceptsTrade && <p className="detail-trade-note"><RotateCcw className="size-4" /> Este vehículo puede tomar permuta. Consultanos.</p>}
        </div>
      </section>
      <section className="detail-specs-section"><div className="container"><div className="detail-section-title"><p className="eyebrow eyebrow-accent">En detalle</p><h2>TODO LO QUE<br /><i>IMPORTA.</i></h2></div><div className="detail-spec-grid">{specifications.map(spec => <div key={spec.label}><span>{spec.label}</span><b>{spec.value}</b></div>)}</div></div></section>
      <section className="detail-transparency"><div className="container transparency-grid"><div><p className="eyebrow eyebrow-accent">Sin letra chica</p><h2>INFORMACIÓN<br /><i>CLARA.</i></h2></div><div className="transparency-cards"><article><FileText className="size-5" /><h3>Documentación</h3><p>{vehicle.documentation ?? "Estado de papeles y transferencia a confirmar con ARRIETA."}</p></article><article><ShieldCheck className="size-5" /><h3>¿Cómo está?</h3><p>{vehicle.conditionSummary ?? "Consultanos para conocer el estado real y coordinar una visita."}</p></article><article><MapPin className="size-5" /><h3>Visita coordinada</h3><p>Podés ver el vehículo en Chacabuco, Buenos Aires, coordinando antes por WhatsApp.</p></article></div></div></section>
      <section className="detail-inquiry-section"><div className="container detail-inquiry-grid"><div><p className="eyebrow eyebrow-accent">Hablemos</p><h2>{sold ? "¿BUSCÁS ALGO\nSIMILAR?" : "¿TE INTERESA\nESTA UNIDAD?"}</h2><p>{sold ? "Contanos qué necesitás y buscamos una opción para vos." : "Dejanos tu contacto y abrimos WhatsApp con la ficha de este vehículo lista para conversar."}</p><a href={getWhatsAppUrl(message, config?.whatsapp)} className="direct-vehicle-wa" target="_blank" rel="noreferrer"><MessageCircle className="size-5" /> Ir directo a WhatsApp</a></div><VehicleInquiryForm vehicle={vehicle} config={config} message={message} /></div></section>
    </main>
    {!sold && <StickyWhatsApp message={message} phone={config?.whatsapp} />}
    <SiteFooter config={config} />
  </div>;
}
