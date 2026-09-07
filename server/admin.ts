import { desc, eq, sql } from "drizzle-orm";
import { leads, siteSettings, vehicleImages, vehicles, vehicleValuations, type InsertVehicle } from "../drizzle/schema";
import { vehicleFromRow, type PublicSiteConfig } from "./inventory";
import { getDb } from "./db";
import { storagePut } from "./storage";

export type AdminVehicleInput = {
  id?: number;
  slug: string;
  type: "moto" | "auto" | "utilitario";
  brand: string;
  model: string;
  version?: string;
  year: number;
  mileage?: number;
  engineCc?: number;
  fuel?: string;
  transmission?: string;
  price?: number;
  priceNote?: string;
  status: "disponible" | "reservado" | "vendido" | "permutado";
  acceptsTrade: boolean;
  description?: string;
  conditionSummary?: string;
  documentation?: string;
  featured: boolean;
  published: boolean;
};

function vehicleValues(input: AdminVehicleInput): InsertVehicle {
  return {
    slug: input.slug,
    type: input.type,
    brand: input.brand,
    model: input.model,
    version: input.version || null,
    year: input.year,
    mileage: input.mileage ?? null,
    engineCc: input.engineCc ?? null,
    fuel: input.fuel || null,
    transmission: input.transmission || null,
    price: input.price ?? null,
    priceNote: input.priceNote || null,
    status: input.status,
    acceptsTrade: input.acceptsTrade ? 1 : 0,
    description: input.description || null,
    conditionSummary: input.conditionSummary || null,
    documentation: input.documentation || null,
    featured: input.featured ? 1 : 0,
    published: input.published ? 1 : 0,
  };
}

export async function listAdminVehicles() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ vehicle: vehicles, image: vehicleImages }).from(vehicles).leftJoin(vehicleImages, eq(vehicleImages.vehicleId, vehicles.id)).orderBy(desc(vehicles.updatedAt));
  const grouped = new Map<number, ReturnType<typeof vehicleFromRow>>();
  for (const row of rows) {
    const current = grouped.get(row.vehicle.id) ?? vehicleFromRow(row.vehicle, []);
    if (row.image) current.images.push({ id: row.image.id, url: row.image.imageUrl, alt: row.image.altText ?? `${row.vehicle.brand} ${row.vehicle.model}`, sortOrder: row.image.sortOrder, isCover: row.image.isCover === 1 });
    grouped.set(row.vehicle.id, current);
  }
  return Array.from(grouped.values()).map(vehicle => ({ ...vehicle, images: vehicle.images.sort((a, b) => a.sortOrder - b.sortOrder) }));
}

export async function saveVehicle(input: AdminVehicleInput) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const values = vehicleValues(input);
  if (input.id) {
    await db.update(vehicles).set(values).where(eq(vehicles.id, input.id));
    return { id: input.id };
  }
  const result = await db.insert(vehicles).values(values);
  return { id: Number(result[0].insertId) };
}

export async function updateVehicleStatus(id: number, status: AdminVehicleInput["status"]) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  await db.update(vehicles).set({ status }).where(eq(vehicles.id, id));
  return { success: true };
}

export async function deleteVehicle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  await db.delete(vehicles).where(eq(vehicles.id, id));
  return { success: true };
}

export async function duplicateVehicle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const source = (await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1))[0];
  if (!source) throw new Error("Vehículo no encontrado.");
  const copy = { ...source, id: undefined, slug: `${source.slug}-copia-${Date.now()}`, published: 0, status: "disponible" as const };
  const result = await db.insert(vehicles).values(copy);
  return { id: Number(result[0].insertId) };
}

export async function addVehicleImage(input: { vehicleId: number; imageUrl: string; altText?: string }) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const result = await db.select({ count: sql<number>`count(*)` }).from(vehicleImages).where(eq(vehicleImages.vehicleId, input.vehicleId));
  const sortOrder = Number(result[0]?.count ?? 0);
  await db.insert(vehicleImages).values({ vehicleId: input.vehicleId, imageUrl: input.imageUrl, altText: input.altText || null, sortOrder, isCover: sortOrder === 0 ? 1 : 0 });
  return { success: true };
}

export async function removeVehicleImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  await db.delete(vehicleImages).where(eq(vehicleImages.id, id));
  return { success: true };
}

export async function uploadVehicleImage(input: { vehicleId: number; filename: string; mimeType: "image/jpeg" | "image/png" | "image/webp"; base64: string }) {
  const data = Buffer.from(input.base64, "base64");
  if (!data.length || data.length > 6_000_000) throw new Error("La foto debe pesar menos de 6 MB.");
  const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100) || "foto.jpg";
  const { url } = await storagePut(`vehicles/${input.vehicleId}/${safeName}`, data, input.mimeType);
  return addVehicleImage({ vehicleId: input.vehicleId, imageUrl: url, altText: "Foto del vehículo" });
}

export async function listRecentLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(30);
}

export async function listRecentValuations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vehicleValuations).orderBy(desc(vehicleValuations.createdAt)).limit(30);
}

export async function updateLeadStatus(id: number, status: "nuevo" | "contactado" | "negociacion" | "cerrado" | "descartado") {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  await db.update(leads).set({ status }).where(eq(leads.id, id));
  return { success: true };
}

export async function saveSiteConfig(input: PublicSiteConfig) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const values = {
    businessName: input.businessName,
    location: input.location,
    whatsapp: input.whatsapp || null,
    instagram: input.instagram || null,
    openingHours: input.openingHours || null,
    address: input.address || null,
    email: input.email || null,
    heroTitle: input.heroTitle || null,
    heroSubtitle: input.heroSubtitle || null,
    defaultWhatsappMessage: input.defaultWhatsappMessage || null,
    permutaEnabled: input.permutaEnabled ? 1 : 0,
    sellVehicleEnabled: input.sellVehicleEnabled ? 1 : 0,
  };
  const existing = (await db.select({ id: siteSettings.id }).from(siteSettings).limit(1))[0];
  if (existing) await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing.id));
  else await db.insert(siteSettings).values(values);
  return { success: true };
}
