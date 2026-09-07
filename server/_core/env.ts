/**
 * Limpia valores de variables de entorno que vinieron mal pegadas desde
 * Vercel: comillas sobrantes, espacios/saltos de línea, o el propio nombre
 * de la variable pegado adelante (ej: pegar "JWT_SECRET=abc123" completo en
 * el campo "Value", en vez de solo "abc123"). Muta process.env directamente
 * para que TODOS los lugares del código que leen process.env.X (no solo los
 * que pasan por ENV) reciban el valor ya limpio.
 */
function sanitizeEnvVar(name: string): void {
  const original = process.env[name];
  if (!original) return;

  let cleaned = original.trim();
  cleaned = cleaned.replace(/^['"]+|['"]+$/g, "").trim();
  // Saca un prefijo tipo "NOMBRE_DE_LA_VAR=" si quedó pegado por error.
  const prefixPattern = new RegExp(`^${name}\\s*=\\s*`, "i");
  cleaned = cleaned.replace(prefixPattern, "");

  if (cleaned !== original) {
    console.warn(
      `[ENV] "${name}" tenía comillas, espacios o el prefijo "${name}=" de más; se limpió automáticamente. ` +
        `Revisá cómo la cargaste en Vercel (Settings → Environment Variables) para que no vuelva a pasar.`
    );
    process.env[name] = cleaned;
  }
}

[
  "JWT_SECRET",
  "DATABASE_URL",
  "VITE_APP_ID",
  "OAUTH_SERVER_URL",
  "OWNER_OPEN_ID",
  "CLOUDINARY_URL",
  "VITE_OAUTH_PORTAL_URL",
].forEach(sanitizeEnvVar);

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

if (!ENV.cookieSecret) {
  console.error(
    "[ENV] JWT_SECRET no está definida (o quedó vacía). El login va a fallar al firmar la sesión."
  );
}
