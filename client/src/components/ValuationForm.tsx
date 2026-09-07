import { CheckCircle2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { PublicSiteConfig } from "../../../server/inventory";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trpc } from "@/lib/trpc";

type FormState = { name: string; whatsapp: string; vehicleType: "moto" | "auto" | "utilitario"; brand: string; model: string; year: string; mileage: string; engineCc: string; conditionSummary: string; hasDocumentation: boolean; acceptsTrade: boolean; expectedPrice: string; notes: string };
const initialForm: FormState = { name: "", whatsapp: "", vehicleType: "moto", brand: "", model: "", year: "", mileage: "", engineCc: "", conditionSummary: "", hasDocumentation: false, acceptsTrade: false, expectedPrice: "", notes: "" };
const numberOrUndefined = (value: string) => value ? Number(value) : undefined;

export function ValuationForm({ config, compact = false }: { config?: PublicSiteConfig; compact?: boolean }) {
  const [values, setValues] = useState<FormState>(initialForm);
  const mutation = trpc.leads.valuation.useMutation();
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setValues(previous => ({ ...previous, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = { ...values, year: numberOrUndefined(values.year), mileage: numberOrUndefined(values.mileage), engineCc: numberOrUndefined(values.engineCc), expectedPrice: numberOrUndefined(values.expectedPrice) };
    try {
      await mutation.mutateAsync(payload);
      const message = `Hola ARRIETA 👋 Soy ${values.name}. Quiero cotizar mi ${values.vehicleType}: ${values.brand} ${values.model}${values.year ? ` ${values.year}` : ""}. Mi WhatsApp es ${values.whatsapp}.${values.mileage ? ` Tiene ${values.mileage} km.` : ""}${values.notes ? ` Observaciones: ${values.notes}` : ""}`;
      toast.success("Listo, abrimos WhatsApp para seguir por ahí.");
      window.location.assign(getWhatsAppUrl(message, config?.whatsapp));
    } catch {
      toast.error("No pudimos registrar la solicitud. Probá nuevamente.");
    }
  };

  return (
    <form className={`valuation-form ${compact ? "valuation-form-compact" : ""}`} onSubmit={submit}>
      {!compact && <div className="form-intro"><span className="number-chip">01</span><div><p className="eyebrow">Cotización directa</p><h2>CONTANOS QUÉ TENÉS.</h2><p>Pasanos lo esencial. Después seguimos por WhatsApp, sin vueltas.</p></div></div>}
      <div className="form-grid">
        <label><span>Tu nombre *</span><input value={values.name} onChange={event => set("name", event.target.value)} required autoComplete="name" placeholder="¿Cómo te llamás?" /></label>
        <label><span>Tu WhatsApp *</span><input value={values.whatsapp} onChange={event => set("whatsapp", event.target.value)} required inputMode="tel" autoComplete="tel" placeholder="Ej. 2352 000000" /></label>
        <label><span>¿Qué querés cotizar? *</span><select value={values.vehicleType} onChange={event => set("vehicleType", event.target.value as FormState["vehicleType"])}><option value="moto">Moto</option><option value="auto">Auto</option><option value="utilitario">Utilitario</option></select></label>
        <label><span>Marca *</span><input value={values.brand} onChange={event => set("brand", event.target.value)} required placeholder="Ej. Honda" /></label>
        <label><span>Modelo *</span><input value={values.model} onChange={event => set("model", event.target.value)} required placeholder="Ej. Wave" /></label>
        <label><span>Año</span><input value={values.year} onChange={event => set("year", event.target.value)} inputMode="numeric" type="number" min="1900" max="2100" placeholder="Ej. 2021" /></label>
        <label><span>Kilómetros</span><input value={values.mileage} onChange={event => set("mileage", event.target.value)} inputMode="numeric" type="number" min="0" placeholder="Ej. 25000" /></label>
        <label><span>Cilindrada</span><input value={values.engineCc} onChange={event => set("engineCc", event.target.value)} inputMode="numeric" type="number" min="1" placeholder="Ej. 150" /></label>
        {!compact && <label className="span-2"><span>Estado general</span><textarea value={values.conditionSummary} onChange={event => set("conditionSummary", event.target.value)} placeholder="Contanos en pocas palabras cómo está." rows={3} /></label>}
      </div>
      {!compact && <div className="form-checks">
        <label><input type="checkbox" checked={values.hasDocumentation} onChange={event => set("hasDocumentation", event.target.checked)} /> <span><CheckCircle2 className="size-4" /> Tiene documentación</span></label>
        <label><input type="checkbox" checked={values.acceptsTrade} onChange={event => set("acceptsTrade", event.target.checked)} /> <span><CheckCircle2 className="size-4" /> Considerás permuta</span></label>
      </div>}
      <button className="primary-button form-submit" type="submit" disabled={mutation.isPending}><Send className="size-4" /> {mutation.isPending ? "Enviando..." : "Enviar para cotizar"}</button>
      <p className="form-disclaimer">Al enviar, abrimos WhatsApp para que ARRIETA pueda responderte de forma directa.</p>
    </form>
  );
}
