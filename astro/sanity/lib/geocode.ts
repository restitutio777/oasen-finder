/**
 * Adresse → Karten-Koordinaten via Nominatim (OpenStreetMap).
 *
 * Kostenlos, kein API-Key nötig. Wird beim Veröffentlichen einer
 * Station aufgerufen, wenn das Adress-Feld gefüllt und Coordinates
 * noch leer ist — siehe AutoSlugPublishAction.
 *
 * Browser-Kontext (Sanity Studio): CORS ist von Nominatim erlaubt,
 * der Browser setzt User-Agent und Referer automatisch.
 *
 * Rate-Limit: 1 Request/Sekunde — bei manuellem Publish unkritisch.
 * Bei Misserfolg (kein Treffer, Netz aus, Service down): null.
 *
 * Timeout: Auf wackligem Mobilfunk (Katharina am Handy) kann ein
 * fetch ohne Abbruch ewig hängen — und blockiert dann den ganzen
 * Publish-Vorgang, der Button dreht endlos. Darum brechen wir nach
 * `timeoutMs` ab und liefern null; das Veröffentlichen läuft dann
 * ohne Auto-Pin weiter (siehe AutoSlugPublishAction).
 */
export async function geocode(
  query: string,
  { timeoutMs = 8000 }: { timeoutMs?: number } = {},
): Promise<{ lat: number; lng: number } | null> {
  if (!query?.trim()) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}` +
      `&format=json&limit=1&addressdetails=0`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!Array.isArray(data) || data.length === 0) return null;
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
    return null;
  } catch (err) {
    console.error('[geocode] Lookup failed:', err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
