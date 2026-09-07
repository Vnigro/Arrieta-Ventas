import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const vehicleTypes = ["moto", "auto", "utilitario"] as const;
export const vehicleStatuses = ["disponible", "reservado", "vendido", "permutado"] as const;
export const leadTypes = ["consulta", "busqueda", "cotizacion", "permuta"] as const;
export const leadStatuses = ["nuevo", "contactado", "negociacion", "cerrado", "descartado"] as const;

export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  type: mysqlEnum("type", vehicleTypes).notNull(),
  brand: varchar("brand", { length: 80 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  version: varchar("version", { length: 120 }),
  year: int("year").notNull(),
  mileage: int("mileage"),
  engineCc: int("engineCc"),
  fuel: varchar("fuel", { length: 60 }),
  transmission: varchar("transmission", { length: 60 }),
  price: int("price"),
  priceNote: varchar("priceNote", { length: 220 }),
  status: mysqlEnum("status", vehicleStatuses).default("disponible").notNull(),
  acceptsTrade: int("acceptsTrade").default(0).notNull(),
  description: text("description"),
  conditionSummary: text("conditionSummary"),
  documentation: text("documentation"),
  featured: int("featured").default(0).notNull(),
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const vehicleImages = mysqlTable("vehicle_images", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  imageUrl: varchar("imageUrl", { length: 1000 }).notNull(),
  altText: varchar("altText", { length: 220 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isCover: int("isCover").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", leadTypes).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 40 }).notNull(),
  vehicleId: int("vehicleId").references(() => vehicles.id, { onDelete: "set null" }),
  message: text("message"),
  status: mysqlEnum("status", leadStatuses).default("nuevo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const vehicleValuations = mysqlTable("vehicle_valuations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 40 }).notNull(),
  vehicleType: mysqlEnum("vehicleType", vehicleTypes).notNull(),
  brand: varchar("brand", { length: 80 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: int("year"),
  mileage: int("mileage"),
  engineCc: int("engineCc"),
  conditionSummary: text("conditionSummary"),
  hasDocumentation: int("hasDocumentation").default(0).notNull(),
  acceptsTrade: int("acceptsTrade").default(0).notNull(),
  expectedPrice: int("expectedPrice"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  businessName: varchar("businessName", { length: 120 }).notNull(),
  location: varchar("location", { length: 180 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 40 }),
  instagram: varchar("instagram", { length: 180 }),
  openingHours: varchar("openingHours", { length: 180 }),
  address: varchar("address", { length: 240 }),
  email: varchar("email", { length: 320 }),
  heroTitle: varchar("heroTitle", { length: 180 }),
  heroSubtitle: text("heroSubtitle"),
  defaultWhatsappMessage: text("defaultWhatsappMessage"),
  financingInfo: text("financingInfo"),
  permutaEnabled: int("permutaEnabled").default(1).notNull(),
  sellVehicleEnabled: int("sellVehicleEnabled").default(1).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type VehicleRow = typeof vehicles.$inferSelect;
export type VehicleImageRow = typeof vehicleImages.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;
