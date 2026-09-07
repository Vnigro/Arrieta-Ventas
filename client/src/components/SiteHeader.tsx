import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { label: "Stock", href: "/vehiculos" },
  { label: "Permutá", href: "/#permuta" },
  { label: "Vendé tu moto", href: "/vender" },
  { label: "Contacto", href: "/#contacto" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-lockup" href="/" aria-label="ARRIETA AUTOS & MOTOS - Inicio" onClick={() => setOpen(false)}>
          <span className="brand-main">ARRIETA</span>
          <span className="brand-sub">AUTOS & MOTOS</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {navItems.map(item => <Link key={item.href} href={item.href} className={location === item.href ? "nav-active" : ""}>{item.label}</Link>)}
        </nav>
        <Link className="header-cta" href="/vender">Cotizá tu vehículo <span aria-hidden="true">↗</span></Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(value => !value)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Navegación móvil">
          {navItems.map((item, index) => <Link key={item.href} href={item.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}<b aria-hidden="true">↗</b></Link>)}
          <Link className="mobile-nav-cta" href="/vender" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>Cotizá tu vehículo</Link>
        </nav>
      </div>
    </header>
  );
}
