import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  content: jsonb("content").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type SiteContentRow = typeof siteContent.$inferSelect;
