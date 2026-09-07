import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { PublicSiteConfig } from "../../../server/inventory";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trpc } from "@/lib/trpc";

export function ContactForm({ config }: { config?: PublicSiteConfig }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const mutation = trpc.leads.create.useMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await mutation.mutateAsync({ type: "consulta", name, whatsapp, message });
      toast.success("Listo, seguimos tu consulta por WhatsApp.");
      window.location.assign(getWhatsAppUrl(`Hola ARRIETA 👋 Soy ${name}. Mi WhatsApp es ${whatsapp}. ${message}`, config?.whatsapp));
    } catch {
      toast.error("No pudimos registrar la consulta. Probá de nuevo.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <p className="eyebrow">Consulta express</p>
      <label><span>Tu nombre *</span><input value={name} onChange={event => setName(event.target.value)} required autoComplete="name" placeholder="¿Cómo te llamás?" /></label>
      <label><span>Tu WhatsApp *</span><input value={whatsapp} onChange={event => setWhatsapp(event.target.value)} required autoComplete="tel" inputMode="tel" placeholder="Ej. 2352 000000" /></label>
      <label><span>¿Sobre qué querés consultar? *</span><textarea value={message} onChange={event => setMessage(event.target.value)} required rows={3} placeholder="Ej. Me interesa la Honda Wave 2023." /></label>
      <button className="contact-form-submit" type="submit" disabled={mutation.isPending}><Send className="size-4" /> {mutation.isPending ? "Abriendo WhatsApp..." : "Enviar consulta"}</button>
    </form>
  );
}
