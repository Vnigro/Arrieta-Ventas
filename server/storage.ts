import { v2 as cloudinary } from "cloudinary";

// Saneamos CLOUDINARY_URL por si llegó con espacios, saltos de línea o
// comillas colgadas desde el panel de variables de entorno (Vercel u otro).
// La librería de cloudinary exige que el string empiece EXACTO con
// "cloudinary://", así que cualquier caracter invisible de más la rompe.
if (process.env.CLOUDINARY_URL) {
  const cleaned = process.env.CLOUDINARY_URL.trim().replace(/^['"]+|['"]+$/g, "").trim();
  if (cleaned !== process.env.CLOUDINARY_URL) {
    console.warn("[Cloudinary] CLOUDINARY_URL tenía espacios o comillas de más; se limpió automáticamente.");
  }
  process.env.CLOUDINARY_URL = cleaned;
}

if (!process.env.CLOUDINARY_URL) {
  console.warn("[Cloudinary] CLOUDINARY_URL no está definida. La subida de imágenes va a fallar.");
} else if (!process.env.CLOUDINARY_URL.toLowerCase().startsWith("cloudinary://")) {
  console.error(
    `[Cloudinary] CLOUDINARY_URL no empieza con "cloudinary://" (empieza con: "${process.env.CLOUDINARY_URL.slice(0, 15)}..."). Revisá la variable en Vercel.`
  );
}

// Configurar Cloudinary usando la variable CLOUDINARY_URL del .env
cloudinary.config();

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));

  // Convertir los datos a Buffer si son Uint8Array o string para Cloudinary
  let bufferData: Buffer;
  if (typeof data === "string") {
    bufferData = Buffer.from(data);
  } else if (data instanceof Uint8Array) {
    bufferData = Buffer.from(data);
  } else {
    bufferData = data;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: key.replace(/\.[^/.]+$/, ""), // Guardar sin extensión para que Cloudinary la gestione
        folder: "arrieta-autos",
      },
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        if (!result) {
          return reject(new Error("Cloudinary returned empty result"));
        }
        resolve({
          key: result.public_id,
          url: result.secure_url,
        });
      }
    );

    uploadStream.end(bufferData);
  });
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  // Devolvemos el recurso optimizado desde Cloudinary
  const url = cloudinary.url(key, { secure: true });
  return { key, url };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const key = normalizeKey(relKey);
  // Cloudinary por defecto genera URLs seguras directas
  return cloudinary.url(key, { secure: true });
}