const trimTrailingSlash = (url) => (typeof url === "string" ? url.replace(/\/$/, "") : "");

const envUrl = trimTrailingSlash(import.meta.env.VITE_API_URL);
const devFallback = "http://localhost:8000";

if (import.meta.env.PROD && !envUrl) {
  console.error(
    "[InfoJolt] VITE_API_URL is missing. In Vercel: Settings → Environment Variables → add VITE_API_URL = your Render API URL (https://….onrender.com), then redeploy."
  );
}

/** Backend origin. In production this must come from Vite env at build time (Vercel). */
export const API_BASE_URL = envUrl || (import.meta.env.DEV ? devFallback : "");
