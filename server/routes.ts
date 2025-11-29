import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchQuerySchema } from "@shared/schema";
import { registerStripeRoutes } from "./stripeRoutes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register Stripe payment routes
  registerStripeRoutes(app);

  // Get all tools with optional filters
  app.get("/api/tools", async (req, res) => {
    try {
      const query = {
        query: req.query.query as string | undefined,
        category: req.query.category as string | undefined,
        pricing: req.query.pricing as string | undefined,
        sort: req.query.sort as "new" | "popular" | "trending" | "top-rated" | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const result = await storage.searchTools(query);
      res.json(result);
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ error: "Failed to fetch tools" });
    }
  });

  // Get featured, trending, and just released tools
  app.get("/api/tools/featured", async (req, res) => {
    try {
      const result = await storage.getFeaturedTools();
      res.json(result);
    } catch (error) {
      console.error("Error fetching featured tools:", error);
      res.status(500).json({ error: "Failed to fetch featured tools" });
    }
  });

  // Get related tools by category
  app.get("/api/tools/related/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const excludeId = req.query.excludeId as string | undefined;
      const result = await storage.getRelatedTools(category, excludeId);
      res.json(result);
    } catch (error) {
      console.error("Error fetching related tools:", error);
      res.status(500).json({ error: "Failed to fetch related tools" });
    }
  });

  // Get single tool by slug
  app.get("/api/tools/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const tool = await storage.getToolBySlug(slug);
      
      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }

      res.json(tool);
    } catch (error) {
      console.error("Error fetching tool:", error);
      res.status(500).json({ error: "Failed to fetch tool" });
    }
  });

  return httpServer;
}
