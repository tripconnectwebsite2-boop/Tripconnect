/**
 * High-reliability Firestore Cloud Persistence layer for Vercel Serverless Functions.
 * Uses direct Firestore REST API over standard HTTPS fetch.
 * Completely eliminates gRPC/WebChannel stream drops, background task aborts, and Code 5 NOT_FOUND errors.
 */

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC6STcc6a82EIrg7apay8QdsH24HobiTRw";
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trip-connect-versel";

const REST_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val: any): any {
  if (!val) return null;
  if ("nullValue" in val) return null;
  if ("booleanValue" in val) return val.booleanValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return val.doubleValue;
  if ("stringValue" in val) return val.stringValue;
  if ("arrayValue" in val) return (val.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in val) {
    const obj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = fromFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

/**
 * Fetch website store directly from Cloud Firestore via HTTPS.
 * Guaranteed stateless, instant, and compatible across all Vercel serverless containers.
 */
export async function fetchStoreFromFirestore(): Promise<any | null> {
  try {
    const url = `${REST_BASE_URL}/tripconnect/store?key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.warn(`[Firestore REST] Fetch failed with status ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (!json.fields) return null;

    const store: Record<string, any> = {};
    for (const [k, v] of Object.entries(json.fields)) {
      store[k] = fromFirestoreValue(v);
    }
    return store;
  } catch (err: any) {
    console.warn("[Firestore REST] Read notice:", err?.message || err);
    return null;
  }
}

/**
 * Save website store directly to Cloud Firestore via HTTPS PATCH.
 * Completely awaited before serverless responses terminate.
 */
export async function saveStoreToFirestore(store: any): Promise<boolean> {
  try {
    const url = `${REST_BASE_URL}/tripconnect/store?key=${FIREBASE_API_KEY}`;
    const cleanStore = JSON.parse(JSON.stringify(store));

    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(cleanStore)) {
      fields[k] = toFirestoreValue(v);
    }

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Firestore REST] Save failed (${res.status}):`, errText);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("[Firestore REST] Write notice:", err?.message || err);
    return false;
  }
}
