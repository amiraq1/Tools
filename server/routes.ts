import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchQuerySchema, insertUserSchema } from "@shared/schema";
import { hash, verify } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const hashedPassword = await hash(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
      });
      req.session!.userId = user.id;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValid = await verify(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session!.userId = user.id;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session!.destroy((err: any) => {
      if (err) return res.status(500).json({ error: "Logout failed" });
      res.json({ success: true });
    });
  });

  // Saved tools routes
  app.get("/api/saved-tools", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const tools = await storage.getSavedTools(req.session.userId);
      res.json({ tools });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saved-tools/ids", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const ids = await storage.getSavedToolIds(req.session.userId);
      res.json({ ids });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/saved-tools/:toolId", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { toolId } = req.params;
      const tool = await storage.getToolById(toolId);
      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }
      const savedTool = await storage.saveTool(req.session.userId, toolId);
      res.json({ success: true, savedTool });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/saved-tools/:toolId", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { toolId } = req.params;
      const removed = await storage.unsaveTool(req.session.userId, toolId);
      res.json({ success: removed });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saved-tools/check/:toolId", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.json({ isSaved: false });
      }
      const { toolId } = req.params;
      const isSaved = await storage.isToolSaved(req.session.userId, toolId);
      res.json({ isSaved });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all tools with optional filters
  app.get("/api/tools", async (req, res) => {
    try {
      const query = {
        query: req.query.query as string | undefined,
        category: req.query.category as any,
        pricing: req.query.pricing as any,
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
