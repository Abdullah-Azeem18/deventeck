// Minimal Supabase access for the server (secret key never reaches the browser).
export function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  const base = url.replace(/\/$/, "").replace(/\/rest\/v1$/, "");
  // New Supabase keys (sb_secret_...) go in the apikey header only; older service_role keys also need Authorization.
  const auth: Record<string, string> = { apikey: key };
  if (!key.startsWith("sb_")) auth.Authorization = `Bearer ${key}`;
  return { base, auth };
}