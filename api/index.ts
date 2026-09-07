import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Ruta de chequeo directo para probar Vercel
app.get("/api", (_req, res) => {
  res.send("Backend Serverless funcionando correctamente!");
});

registerStorageProxy(app);
registerOAuthRoutes(app);

// Escucha tanto en /api/trpc como en /trpc por flexibilidad de Vercel
app.use(
  ["/api/trpc", "/trpc"],
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;