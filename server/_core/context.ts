import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { sdk } from "./sdk";

const ALLOWED_ADMIN_EMAILS = [
  "admin@arrietaautos.com",
  // Agregá acá tu mail real y el de la clienta
  "nigrovalentin6@gmail.com",       // 👈 Correo del desarrollador
  "melisaarrieta@gmail.com" // 👈 Correo del dueño del negocio
].map((email) => email.toLowerCase().trim());

export async function createContext({ req, res }: CreateExpressContextOptions) {
  try {
    const user = await sdk.authenticateRequest(req);

    if (!user) {
      return { req, res, user: null };
    }

    // 🔑 Si el mail en BD vino nulo por pruebas anteriores, usamos el mail asignado a admin-owner
    const userEmail = (
      user.email || (user.openId === "admin-owner" ? "admin@arrietaautos.com" : "")
    )
      .toLowerCase()
      .trim();

    // Verificación contra lista blanca
    const isAllowed = ALLOWED_ADMIN_EMAILS.includes(userEmail);

    if (!isAllowed) {
      return { req, res, user: null };
    }

    return {
      req,
      res,
      user: {
        ...user,
        email: userEmail,
        role: "admin",
      },
    };
  } catch (error) {
    return { req, res, user: null };
  }
}
export type TrpcContext = Awaited<ReturnType<typeof createContext>>;
