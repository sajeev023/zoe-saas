import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // ── Fix 5: Google OAuth placeholder routes ──
  // In production: replace with real Passport/OAuth flow
  app.get("/api/auth/google", (_req, res) => {
    // Demo: redirect straight to onboarding
    // Production: redirect to Google OAuth consent screen
    res.redirect("/onboarding");
  });

  app.get("/api/auth/google/callback", (_req, res) => {
    res.redirect("/onboarding");
  });

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // REST API routes for AI generation
  app.post("/api/campaigns/generateWhatsAppReport", async (req, res) => {
    try {
      const { leads, bestAd, cpl, spend, roas, actions } = req.body;
      const { generateWhatsAppReport } = await import("../modules/aiService");
      const report = await generateWhatsAppReport({
        leads,
        bestAd,
        cpl,
        spend,
        roas,
        actions,
      });
      res.json({ report });
    } catch (e) {
      res.status(500).json({ error: "Failed to generate" });
    }
  });

  app.post("/api/campaigns/generateAdCopy", async (req, res) => {
    try {
      const { businessName, goal, format, city } = req.body;
      const { generateAdCopy } = await import("../modules/aiService");
      const ad = await generateAdCopy({ businessName, goal, format, city });
      res.json(ad);
    } catch (e) {
      res.status(500).json({ error: "Failed to generate" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
