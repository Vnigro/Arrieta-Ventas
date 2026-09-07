import { ArrowDown, ArrowRight, BadgeCheck, ChevronRight, Gauge, MapPin, MessageCircle, RotateCcw, Search, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VehicleCard } from "@/components/VehicleCard";
import { ValuationForm } from "@/components/ValuationForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { trpc } from "@/lib/trpc";

// Imagen neutra de respaldo en caso de que no haya ningún vehículo publicado aún
const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=80";

export default function Home() {
  const { data: config } = trpc.site.config.useQuery();
  const { data: vehicles, isLoading } = trpc.inventory.list.useQuery({ sort: "recientes" });
  
  // Buscar los vehículos marcados como destacados
  const featured = vehicles?.filter(vehicle => vehicle.featured).slice(0, 2) ?? [];
  const featuredVehicle = featured[0] ?? vehicles?.[0];

  // Obtener la URL dinámica de la foto de Cloudinary del vehículo destacado
  const heroImageUrl = featuredVehicle?.images?.[0]?.url || DEFAULT_FALLBACK_IMAGE;

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero-section">
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="container hero-grid">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
              <p className="hero-location"><MapPin className="size-3.5" /> {config?.location ?? "Chacabuco · Buenos Aires"}</p>
              <h1>{(config?.heroTitle ?? "TU PRÓXIMA MOTO ARRANCA ACÁ.").split(" ").map((word, index) => <span key={`${word}-${index}`} className={index === 2 ? "accent-word" : ""}>{word} </span>)}</h1>
              <p className="hero-description">{config?.heroSubtitle ?? "Stock real, atención directa y una forma más simple de comprar, vender o permutar."}</p>
              <div className="hero-actions">
                <Link href="/vehiculos" className="primary-button">Ver stock <ArrowRight className="size-4" /></Link>
                <Link href="/vender" className="text-button">Cotizá tu vehículo <ArrowRight className="size-4" /></Link>
              </div>
            </motion.div>
            <motion.div className="hero-image-wrap hidden hidden lg:block" initial={{ opacity: 0, scale: 0.97, x: 35 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}>
              {/* Ahora esta imagen es 100% dinámica basada en el checkbox del Admin */}
              <img 
                src={heroImageUrl} 
                alt={featuredVehicle ? `${featuredVehicle.brand} ${featuredVehicle.model}` : "Vehículo en ARRIETA AUTOS & MOTOS"} 
                fetchPriority="high" 
              />
              <div className="hero-image-label"><span>01</span><p>Stock<br />seleccionado</p></div>
              <div className="hero-badge"><span className="live-dot" /> Consultas abiertas</div>
            </motion.div>
            <div className="hero-rail" aria-hidden="true"><span>COMPRA · VENTA · PERMUTA · COMPRA · VENTA · PERMUTA ·</span></div>
            <a href="#stock" className="hero-scroll" aria-label="Bajar a stock actual"><ArrowDown className="size-4" /><span>Explorar</span></a>
          </div>
        </section>

        <section id="stock" className="stock-section section-dark">
          <div className="container">
            <div className="section-heading stock-heading">
              <div><p className="eyebrow eyebrow-accent">Stock actual <span className="stock-count">{isLoading ? "—" : String(vehicles?.length ?? 0).padStart(2, "0")}</span></p><h2>LO QUE TENEMOS<br /><i>HOY.</i></h2></div>
              <div className="section-heading-side"><p>Cada vehículo con su historia, sus datos claros y una línea directa para consultarlo.</p><Link href="/vehiculos" className="outlined-link">Ver todo el stock <ArrowRight className="size-4" /></Link></div>
            </div>
            <div className="stock-featured-layout">
              {isLoading ? <div className="stock-loading">Cargando vehículos...</div> : featured.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index === 0} />)}
              {!isLoading && featured.length === 0 && <div className="stock-loading">Pronto vas a poder ver el stock actual.</div>}
            </div>
            <div className="stock-bottom-cta"><span className="stock-line" /><p>¿No encontraste lo que buscabas?</p><a href="#contacto">Decinos qué buscás <ArrowRight className="size-4" /></a></div>
          </div>
        </section>

        <section className="feature-vehicle-section">
          <div className="container">
            <div className="feature-vehicle-grid">
              <div className="feature-vehicle-art">
                <img src={heroImageUrl} alt={featuredVehicle?.images?.[0]?.alt ?? "Moto disponible"} loading="lazy" />
                <div className="feature-art-price">{featuredVehicle ? <><span>Desde</span><strong>{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(featuredVehicle.price ?? 0)}</strong></> : null}</div>
              </div>
              <div className="feature-vehicle-copy">
                <p className="eyebrow">Elegida de la semana</p>
                <h2>{featuredVehicle ? `${featuredVehicle.brand} ${featuredVehicle.model}` : "MOTO SELECCIONADA"} <em>{featuredVehicle?.year ?? ""}</em></h2>
                <p>{featuredVehicle?.description ?? "Mirá el stock, consultá lo que necesites y coordiná una visita."}</p>
                <div className="feature-spec-row"><span><Gauge className="size-4" /> {featuredVehicle?.mileage ? `${new Intl.NumberFormat("es-AR").format(featuredVehicle.mileage)} km` : "Kilometraje a consultar"}</span><span><RotateCcw className="size-4" /> {featuredVehicle?.acceptsTrade ? "Toma permuta" : "Consultar permuta"}</span></div>
                {featuredVehicle && <Link href={`/vehiculos/${featuredVehicle.slug}`} className="primary-button">Ver ficha completa <ArrowRight className="size-4" /></Link>}
              </div>
            </div>
          </div>
        </section>

        <section id="permuta" className="trade-section">
          <div className="container trade-grid">
            <div className="trade-title"><p className="eyebrow">Tu vehículo también vale</p><h2>¿TENÉS UN<br />VEHÍCULO?<br /><i>LO TOMAMOS.</i></h2><p>Puede ser el comienzo de tu próxima operación.</p></div>
            <div className="trade-process">
              {["Mandanos los datos.", "Revisamos tu vehículo.", "Evaluamos su valor.", "Te proponemos una operación.", "Coordinamos la revisión."].map((item, index) => <div className="trade-step" key={item}><span>0{index + 1}</span><p>{item}</p><ChevronRight className="size-4" /></div>)}
              <Link href="/vender" className="trade-cta">Quiero cotizar mi vehículo <ArrowRight className="size-5" /></Link>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="container trust-grid">
            <div className="trust-heading"><p className="eyebrow eyebrow-accent">Sin vueltas</p><h2>COMPRAR USADO<br />CON <i>INFORMACIÓN</i><br />CLARA.</h2></div>
            <div className="trust-list">
              <div><BadgeCheck className="size-5" /><h3>Atención directa</h3><p>Una conversación real para sacarte las dudas antes de decidir.</p></div>
              <div><ShieldCheck className="size-5" /><h3>Datos transparentes</h3><p>Estado, condiciones y documentación se conversan con claridad.</p></div>
              <div><Search className="size-5" /><h3>Visita coordinada</h3><p>Consultá, coordiná y mirá el vehículo con el tiempo que necesitás.</p></div>
            </div>
          </div>
        </section>

        <section id="contacto" className="contact-section">
          <div className="container contact-grid">
            <div className="contact-copy"><p className="eyebrow eyebrow-accent">Estamos cerca</p><h2>UNA DUDA.<br /><i>UN MENSAJE.</i></h2><p>Consultanos por una moto, un auto, una permuta o el vehículo que estás buscando. Respondemos por WhatsApp.</p><WhatsAppButton phone={config?.whatsapp} message={config?.defaultWhatsappMessage ?? "Hola ARRIETA 👋 Quería hacer una consulta."} label="Hablar con ARRIETA" dark /></div>
            <div className="contact-side"><div className="contact-meta"><div><span>Base</span><p><MapPin className="size-4" /> {config?.location ?? "Chacabuco · Buenos Aires"}</p></div><div><span>Canal directo</span><p><MessageCircle className="size-4" /> WhatsApp</p></div><div><span>Horarios</span><p>{config?.openingHours ?? "Consultanos por WhatsApp"}</p></div><p className="contact-note"><Sparkles className="size-4" /> Atención personalizada para cada operación.</p></div><ContactForm config={config} /></div>
          </div>
        </section>

        <section className="valuation-section">
          <div className="container valuation-grid"><ValuationForm config={config} /><aside className="valuation-aside"><span className="aside-counter">02</span><p className="eyebrow">Vender o permutar</p><h3>SI ES TU MOTO,<br />TAMBIÉN ES<br /><i>EL PRIMER PASO.</i></h3><p>Mandanos los datos básicos. La evaluación siempre sigue por una conversación directa.</p><Link href="/vender" className="text-button">Abrir formulario completo <ArrowRight className="size-4" /></Link></aside></div>
        </section>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}