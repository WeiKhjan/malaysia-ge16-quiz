// Browser-side helpers for capturing GPS once and stashing for later submission.

export interface StoredGps {
  lat: number;
  lng: number;
  accuracy?: number;
  ts: number;
}

const KEY = "ge16.gps";
const DECISION_KEY = "ge16.gps.decided"; // "granted" | "denied"

export function getStoredGps(): StoredGps | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as StoredGps;
    if (!Number.isFinite(v.lat) || !Number.isFinite(v.lng)) return null;
    return v;
  } catch {
    return null;
  }
}

export function getGpsDecision(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  return (sessionStorage.getItem(DECISION_KEY) as "granted" | "denied" | null) ?? null;
}

// Asks the browser for geolocation once. Resolves with coords or null.
// Does NOT throw. Caller can then route to the next page regardless.
export function requestGpsOnce(timeoutMs = 8000): Promise<StoredGps | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      sessionStorage.setItem(DECISION_KEY, "denied");
      resolve(null);
      return;
    }
    let settled = false;
    const finish = (val: StoredGps | null, decision: "granted" | "denied") => {
      if (settled) return;
      settled = true;
      sessionStorage.setItem(DECISION_KEY, decision);
      if (val) sessionStorage.setItem(KEY, JSON.stringify(val));
      resolve(val);
    };
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        finish(
          {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            ts: Date.now(),
          },
          "granted",
        ),
      () => finish(null, "denied"),
      { timeout: timeoutMs, maximumAge: 60_000, enableHighAccuracy: false },
    );
  });
}
