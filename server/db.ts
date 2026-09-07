import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { leads, siteSettings, vehicleImages, vehicles, vehicleValuations, type User } from "../drizzle/schema";
import { defaultSiteConfig, defaultVehicles, type InventoryFilters, type PublicSiteConfig, type Vehicle, vehicleFromRow } from "./inventory";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: typeof import("../drizzle/schema").users.$inferInsert): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values = { ...user, lastSignedIn: user.lastSignedIn ?? new Date(), role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user") };
  await db.insert((await import("../drizzle/schema")).users).values(values).onDuplicateKeyUpdate({
    set: { name: values.name, email: values.email, loginMethod: values.loginMethod, lastSignedIn: values.lastSignedIn, role: values.role },
  });
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from((await import("../drizzle/schema")).users).where(eq((await import("../drizzle/schema")).users.openId, openId)).limit(1);
  return result[0];
}

async function databaseVehicles(): Promise<Vehicle[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ vehicle: vehicles, image: vehicleImages }).from(vehicles).leftJoin(vehicleImages, eq(vehicleImages.vehicleId, vehicles.id)).orderBy(desc(vehicles.createdAt));
  if (!rows.length) return [];
  const grouped = new Map<number, Vehicle>();
  for (const row of rows) {
    const current = grouped.get(row.vehicle.id) ?? vehicleFromRow(row.vehicle, []);
    if (row.image) {
      current.images.push({ id: row.image.id, url: row.image.imageUrl, alt: row.image.altText ?? `${row.vehicle.brand} ${row.vehicle.model}`, sortOrder: row.image.sortOrder, isCover: row.image.isCover === 1 });
    }
    grouped.set(row.vehicle.id, current);
  }
  return Array.from(grouped.values()).map(vehicle => ({ ...vehicle, images: vehicle.images.sort((a, b) => a.sortOrder - b.sortOrder) }));
}

export async function listPublicVehicles(filters: InventoryFilters = {}) {
  try {
    const stored = await databaseVehicles();
    const source = stored.length ? stored : defaultVehicles;
    const { filterVehicles } = await import("./inventory");
    return filterVehicles(source, filters);
  } catch (error) {
    console.warn("[Inventory] Falling back to configurable initial inventory:", error);
    const { filterVehicles } = await import("./inventory");
    return filterVehicles(defaultVehicles, filters);
  }
}

export async function findPublicVehicle(slug: string) {
  const source = await listPublicVehicles();
  return source.find(vehicle => vehicle.slug === slug);
}

export async function getPublicSiteConfig(): Promise<PublicSiteConfig> {
  try {
    const db = await getDb();
    if (!db) return defaultSiteConfig;
    const row = (await db.select().from(siteSettings).limit(1))[0];
    if (!row) return defaultSiteConfig;
    return {
      businessName: row.businessName,
      location: row.location,
      whatsapp: row.whatsapp ?? "",
      instagram: row.instagram ?? "",
      openingHours: row.openingHours ?? "Consultanos por WhatsApp",
      address: row.address ?? row.location,
      email: row.email ?? "",
      heroTitle: row.heroTitle ?? defaultSiteConfig.heroTitle,
      heroSubtitle: row.heroSubtitle ?? defaultSiteConfig.heroSubtitle,
      defaultWhatsappMessage: row.defaultWhatsappMessage ?? defaultSiteConfig.defaultWhatsappMessage,
      permutaEnabled: row.permutaEnabled === 1,
      sellVehicleEnabled: row.sellVehicleEnabled === 1,
    };
  } catch {
    return defaultSiteConfig;
  }
}

export async function createPublicLead(input: { type: "consulta" | "busqueda" | "cotizacion" | "permuta"; name: string; whatsapp: string; vehicleId?: number; message?: string }) {
  const db = await getDb();
  if (!db) return { stored: false };
  await db.insert(leads).values({ ...input, vehicleId: input.vehicleId && input.vehicleId > 0 ? input.vehicleId : null });
  return { stored: true };
}

export async function createValuation(input: { name: string; whatsapp: string; vehicleType: "moto" | "auto" | "utilitario"; brand: string; model: string; year?: number; mileage?: number; engineCc?: number; conditionSummary?: string; hasDocumentation?: boolean; acceptsTrade?: boolean; expectedPrice?: number; notes?: string }) {
  const db = await getDb();
  if (!db) return { stored: false };
  await db.insert(vehicleValuations).values({ ...input, hasDocumentation: input.hasDocumentation ? 1 : 0, acceptsTrade: input.acceptsTrade ? 1 : 0 });
  return { stored: true };
}
