import { z } from "zod";
import { addVehicleImage, deleteVehicle, duplicateVehicle, listAdminVehicles, listRecentLeads, listRecentValuations, removeVehicleImage, saveSiteConfig, saveVehicle, updateLeadStatus, updateVehicleStatus, uploadVehicleImage } from "./admin";
import { createPublicLead, createValuation, findPublicVehicle, getPublicSiteConfig, listPublicVehicles } from "./db";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

const vehicleType = z.enum(["moto", "auto", "utilitario"]);
const vehicleStatus = z.enum(["disponible", "reservado", "vendido", "permutado"]);
const leadType = z.enum(["consulta", "busqueda", "cotizacion", "permuta"]);
const vehicleInput = z.object({
  id: z.number().int().positive().optional(), slug: z.string().trim().min(3).max(160).regex(/^[a-z0-9-]+$/), type: vehicleType, brand: z.string().trim().min(1).max(80), model: z.string().trim().min(1).max(100), version: z.string().trim().max(120).optional(), year: z.number().int().min(1900).max(2100), mileage: z.number().int().nonnegative().optional(), engineCc: z.number().int().positive().optional(), fuel: z.string().trim().max(60).optional(), transmission: z.string().trim().max(60).optional(), price: z.number().int().nonnegative().optional(), priceNote: z.string().trim().max(220).optional(), status: vehicleStatus, acceptsTrade: z.boolean(), description: z.string().trim().max(5000).optional(), conditionSummary: z.string().trim().max(5000).optional(), documentation: z.string().trim().max(5000).optional(), featured: z.boolean(), published: z.boolean(),
});
const siteConfigInput = z.object({ businessName: z.string().trim().min(2).max(120), location: z.string().trim().min(2).max(180), whatsapp: z.string().trim().max(40), instagram: z.string().trim().max(180), openingHours: z.string().trim().max(180), address: z.string().trim().max(240), email: z.string().trim().email().or(z.literal("")), heroTitle: z.string().trim().max(180), heroSubtitle: z.string().trim().max(2000), defaultWhatsappMessage: z.string().trim().max(2000), permutaEnabled: z.boolean(), sellVehicleEnabled: z.boolean() });

const inventoryFilters = z.object({
  type: vehicleType.optional(),
  brand: z.string().trim().max(80).optional(),
  status: vehicleStatus.optional(),
  query: z.string().trim().max(100).optional(),
  minPrice: z.number().int().nonnegative().optional(),
  maxPrice: z.number().int().nonnegative().optional(),
  minYear: z.number().int().min(1900).max(2100).optional(),
  maxYear: z.number().int().min(1900).max(2100).optional(),
  acceptsTrade: z.boolean().optional(),
  sort: z.enum(["recientes", "precio-asc", "precio-desc", "anio-desc", "km-asc"]).optional(),
}).optional();

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);

      // 🔒 Borrado garantizado: maxAge en 0 y fecha en el pasado (1970)
      ctx.res.clearCookie(COOKIE_NAME, {
        ...cookieOptions,
        maxAge: 0,
        expires: new Date(0),
      });

      return { success: true } as const;
    }),
  }),
  site: router({
    config: publicProcedure.query(() => getPublicSiteConfig()),
  }),
  inventory: router({
    list: publicProcedure.input(inventoryFilters).query(({ input }) => listPublicVehicles(input ?? {})),
    bySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(160) })).query(({ input }) => findPublicVehicle(input.slug)),
  }),
  leads: router({
    create: publicProcedure.input(z.object({
      type: leadType,
      name: z.string().trim().min(2).max(120),
      whatsapp: z.string().trim().min(6).max(40),
      vehicleId: z.number().int().optional(),
      message: z.string().trim().max(2000).optional(),
    })).mutation(({ input }) => createPublicLead(input)),
    valuation: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(120),
      whatsapp: z.string().trim().min(6).max(40),
      vehicleType,
      brand: z.string().trim().min(1).max(80),
      model: z.string().trim().min(1).max(100),
      year: z.number().int().min(1900).max(2100).optional(),
      mileage: z.number().int().nonnegative().optional(),
      engineCc: z.number().int().positive().optional(),
      conditionSummary: z.string().trim().max(1200).optional(),
      hasDocumentation: z.boolean().optional(),
      acceptsTrade: z.boolean().optional(),
      expectedPrice: z.number().int().nonnegative().optional(),
      notes: z.string().trim().max(2000).optional(),
    })).mutation(({ input }) => createValuation(input)),
  }),
  admin: router({
    vehicles: adminProcedure.query(() => listAdminVehicles()),
    saveVehicle: adminProcedure.input(vehicleInput).mutation(({ input }) => saveVehicle(input)),
    updateVehicleStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: vehicleStatus })).mutation(({ input }) => updateVehicleStatus(input.id, input.status)),
    duplicateVehicle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => duplicateVehicle(input.id)),
    deleteVehicle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteVehicle(input.id)),
    addImage: adminProcedure.input(z.object({ vehicleId: z.number().int().positive(), imageUrl: z.string().url().max(1000), altText: z.string().trim().max(220).optional() })).mutation(({ input }) => addVehicleImage(input)),
    removeImage: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeVehicleImage(input.id)),
    uploadImage: adminProcedure.input(z.object({ vehicleId: z.number().int().positive(), filename: z.string().trim().max(120), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]), base64: z.string().min(1).max(8_000_000) })).mutation(({ input }) => uploadVehicleImage(input)),
    leads: adminProcedure.query(() => listRecentLeads()),
    valuations: adminProcedure.query(() => listRecentValuations()),
    updateLeadStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["nuevo", "contactado", "negociacion", "cerrado", "descartado"]) })).mutation(({ input }) => updateLeadStatus(input.id, input.status)),
    saveConfig: adminProcedure.input(siteConfigInput).mutation(({ input }) => saveSiteConfig(input)),
  }),
});

export type AppRouter = typeof appRouter;
