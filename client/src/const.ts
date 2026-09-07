import { OAUTH_STATE_COOKIE, encodeOAuthState } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const startLogin = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // Atrapa tanto si es undefined real como si Vite lo inyectó como el string "undefined"
  const isInvalidUrl = !oauthPortalUrl || oauthPortalUrl === "undefined";
  const isInvalidApp = !appId || appId === "undefined";

  if (isInvalidUrl || isInvalidApp) {
    alert("Faltan configurar las variables VITE_OAUTH_PORTAL_URL o VITE_APP_ID en el panel de Vercel.");
    return;
  }

  try {
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const nonce = crypto.randomUUID();

    const isSecure = window.location.protocol === "https:";
    const cookieName = isSecure ? OAUTH_STATE_COOKIE : "oauth_state";
    const sameSite = isSecure ? "None" : "Lax";
    const secureFlag = isSecure ? "; Secure" : "";

    document.cookie = `${cookieName}=${nonce}; Path=/; Max-Age=600; SameSite=${sameSite}${secureFlag}`;

    const state = encodeOAuthState({ redirectUri, nonce });

    const baseUrl = oauthPortalUrl.replace(/\/$/, "");
    const url = new URL(`${baseUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    window.location.href = url.toString();
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    alert("La URL de autenticación no es válida. Revisa las variables en Vercel.");
  }
};