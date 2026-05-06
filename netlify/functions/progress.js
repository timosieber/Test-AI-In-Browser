// =====================================================================
// Netlify Function: /api/progress
// =====================================================================
// Speichert den Lernfortschritt eines Schuelers in Netlify Blobs
// (Key-Value-Store). Schluessel ist der vom Schueler eingegebene Name,
// normalisiert (lowercase, ASCII-fold der ueblichen Umlaute).
//
// Methoden:
//   GET    /api/progress?name=<name>  -> { name, key, progress, updatedAt }
//   POST   /api/progress?name=<name>  body: { progress: {...} } -> { ok, key, updatedAt }
//   DELETE /api/progress?name=<name>  -> { ok }
//
// Datenschutz:
//   Im Blob-Store landet ausschliesslich der normalisierte Name und die
//   Counter-Statistik (good/partial/bad/last je Lehrziel). Keine Antworten,
//   keine Fragen, keine personenbezogenen Daten ausser dem Namen.

import { getStore } from "@netlify/blobs";

const STORE = "finanzsystem-trainer";

function nameToKey(name) {
  // Normalisiere Namen: trim, lowercase, ASCII-fold der ueblichen Umlaute,
  // erlaube nur [a-z0-9_-], 2-40 Zeichen.
  const folded = String(name)
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (folded.length < 2 || folded.length > 40) return null;
  return folded;
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const url = new URL(req.url);
  const rawName = url.searchParams.get("name") || "";
  const key = nameToKey(rawName);
  if (!key) {
    return new Response(JSON.stringify({ error: "invalid_name" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const store = getStore({ name: STORE, consistency: "strong" });

  try {
    if (req.method === "GET") {
      const data = await store.get(key, { type: "json" });
      return new Response(JSON.stringify({ name: rawName.trim(), key, progress: data?.progress ?? {}, updatedAt: data?.updatedAt ?? null }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => null);
      if (!body || typeof body.progress !== "object") {
        return new Response(JSON.stringify({ error: "invalid_body" }), {
          status: 400, headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      const payload = { progress: body.progress, updatedAt: new Date().toISOString() };
      await store.setJSON(key, payload);
      return new Response(JSON.stringify({ ok: true, key, updatedAt: payload.updatedAt }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      await store.delete(key);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response("method_not_allowed", { status: 405, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: "server_error", message: e?.message ?? String(e) }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/progress" };
