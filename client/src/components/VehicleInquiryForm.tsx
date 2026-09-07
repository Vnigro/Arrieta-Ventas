import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { PublicSiteConfig, Vehicle } from "../../../server/inventory";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trpc } from "@/lib/trpc";

export function VehicleInquiryForm({ vehicle, config, message }: { vehicle: Vehicle; config?: PublicSiteConfig; message: string }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");
  const mutation = trpc.leads.create.useMutation();
  const available = vehicle.status === "disponible" || vehicle.status === "reservado";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await mutation.mutateAsync({ type: "consulta", name, whatsapp, vehicleId: vehicle.id, message: note || message });
      toast.success("Listo, continuamos la consulta por WhatsApp.");
      window.location.assign(getWhatsAppUrl(`${message}\n\nSoy ${name}. Mi WhatsApp es ${whatsapp}.${note ? ` ${note}` : ""}`, config?.whatsapp));
    } catch {
      toast.error("No pudimos registrar la consulta. Probá nuevamente.");
    }
  }

  return (
    <form className="vehicle-inquiry-form" onSubmit={submit}>
      <p className="eyebrow">Consulta rápida</p>
      <p className="vehicle-inquiry-heading">{available ? "¿LA QUERÉS VER?" : "¿BUSCÁS ALGO PARECIDO?"}</p>
      <div className="vehicle-inquiry-grid"><label><span>Tu nombre *</span><input required value={name} onChange={event => setName(event.target.value)} placeholder="Nombre" autoComplete="name" /></label><label><span>WhatsApp *</span><input required value={whatsapp} onChange={event => setWhatsapp(event.target.value)} placeholder="2352 000000" inputMode="tel" autoComplete="tel" /></label></div>
      <label><span>Mensaje (opcional)</span><textarea value={note} onChange={event => setNote(event.target.value)} rows={2} placeholder="¿Qué te gustaría saber?" /></label>
      <button className="primary-button" disabled={mutation.isPending} type="submit"><Send className="size-4" /> {mutation.isPending ? "Abriendo WhatsApp..." : "Enviar consulta"}</button>
    </form>
  );
}
