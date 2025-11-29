import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// AI Tool Categories
export const categories = [
  "Personal",
  "Work",
  "Creativity",
  "Writing",
  "Images",
  "Videos",
  "Audio",
  "Code",
  "Data",
  "Marketing",
  "Sales",
  "Customer Support",
  "Education",
  "Research",
  "Productivity",
  "Social Media",
  "Design",
  "Finance",
  "Legal",
  "Healthcare",
] as const;

export type Category = typeof categories[number];

// Pricing Types
export const pricingTypes = [
  "Free",
  "Freemium", 
  "Free Trial",
  "Paid",
] as const;

export type PricingType = typeof pricingTypes[number];

// Sort Options
export const sortOptions = [
  "new",
  "popular",
  "trending",
  "top-rated",
] as const;

export type SortOption = typeof sortOptions[number];

// AI Tool Schema
export const aiToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  tagline: z.string(),
  description: z.string(),
  category: z.enum(categories),
  pricing: z.enum(pricingTypes),
  priceDetails: z.string().optional(),
  websiteUrl: z.string().url(),
  iconColor: z.string(),
  iconInitials: z.string(),
  votes: z.number(),
  saves: z.number(),
  views: z.number(),
  rating: z.number().min(0).max(5),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isTrending: z.boolean(),
  releasedAt: z.string(),
  features: z.array(z.string()),
  tags: z.array(z.string()),
});

export type AITool = z.infer<typeof aiToolSchema>;

// Insert AI Tool Schema (without auto-generated fields)
export const insertAIToolSchema = aiToolSchema.omit({ id: true });
export type InsertAITool = z.infer<typeof insertAIToolSchema>;

// Search Query Schema
export const searchQuerySchema = z.object({
  query: z.string().optional(),
  category: z.enum(categories).optional(),
  pricing: z.enum(pricingTypes).optional(),
  sort: z.enum(sortOptions).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// API Response Types
export interface ToolsResponse {
  tools: AITool[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FeaturedToolsResponse {
  featured: AITool[];
  trending: AITool[];
  justReleased: AITool[];
}
