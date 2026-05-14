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
 */
export async function geocode(
  query: string,
): Promise<{ lat: number; lng: number } | null> {
  if (!query?.trim()) return null;
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}` +
      `&format=json&limit=1&addressdetails=0`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
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
  }
}
