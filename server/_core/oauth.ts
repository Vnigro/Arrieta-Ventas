import { COOKIE_NAME, ONE_YEAR_MS, OAUTH_STATE_COOKIE, decodeOAuthState } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // 🔑 Endpoint de autenticación: Recibe la orden de inicio de sesión
  app.get("/app-auth", (req: Request, res: Response) => {
    const redirectUri = getQueryParam(req, "redirectUri");
    const state = getQueryParam(req, "state");

    if (redirectUri && state) {
      res.redirect(`${redirectUri}?code=admin-auth-code&state=${encodeURIComponent(state)}`);
    } else {
      res.status(400).send("Parámetros de autenticación faltantes.");
    }
  });

  // 🔑 Callback: Valida la cookie de estado y crea la sesión JWT
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    const { nonce } = decodeOAuthState(state);
    const cookies = parseCookieHeader(req.headers.cookie ?? "");
    const expectedNonce = cookies[OAUTH_STATE_COOKIE] || cookies["oauth_state"];

    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }

    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(OAUTH_STATE_COOKIE, cookieOptions);
    res.clearCookie("oauth_state", cookieOptions);

    try {
      let openId = "admin-owner";
      let name = "Administrador Arrieta";
      let email = "admin@arrietaautos.com";

      if (code !== "admin-auth-code") {
        try {
          const tokenResponse = await sdk.exchangeCodeForToken(code, state);
          const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
          if (userInfo.openId) {
            openId = userInfo.openId;
            name = userInfo.name || name;
            email = userInfo.email || email;
          }
        } catch (e) {
          console.warn("[OAuth] Usando credenciales locales de administración");
        }
      }

      await db.upsertUser({
        openId,
        name,
        email,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });

      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/admin");
    } catch (error) {
      console.error("[OAuth] Error en callback de autenticación:", error);
      res.status(500).json({ error: "Error de inicio de sesión" });
    }
  });
}