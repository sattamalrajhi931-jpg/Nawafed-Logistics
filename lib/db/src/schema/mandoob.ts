import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mandoobRegistrations = pgTable("mandoob_registrations", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  nationalId: text("national_id").notNull(),
  city: text("city").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  hasLicense: boolean("has_license").notNull().default(false),
  experience: text("experience").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMandoobSchema = createInsertSchema(mandoobRegistrations).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertMandoob = z.infer<typeof insertMandoobSchema>;
export type Mandoob = typeof mandoobRegistrations.$inferSelect;
