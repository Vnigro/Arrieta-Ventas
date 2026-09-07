import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth.js";
import { registerStorageProxy } from "./storageProxy.js";
import { appRouter } from "../routers.js";
import { createContext } from "./context.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerStorageProxy(app);
registerOAuthRoutes(app);

app.use(
  ["/api/trpc", "/trpc"],
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export { app };
export default app;

async function startServer() {
  const server = createServer(app);
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
  } else {
    const { serveStatic } = await import("./vite.js");
    serveStatic(app);
  }

  const port = Number(process.env.PORT ?? 3000);
  server.listen(port, "0.0.0.0", () => {
    console.log(`[Server] Listening on http://localhost:${port}` );
  });
}

if (process.env.NODE_ENV === "development") {
  startServer();
}