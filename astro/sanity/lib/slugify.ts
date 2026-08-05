/**
 * Slug-Generator für deutsche Titel.
 *
 * Beispiele:
 *   "Frühjahr auf Kreta"     → "fruehjahr-auf-kreta"
 *   "Café & mehr!"            → "cafe-mehr"
 *   "Tempelhof, Hohenlohe"    → "tempelhof-hohenlohe"
 *
 * Wird in der AutoSlugPublishAction aufgerufen, wenn Katharina ein
 * Dokument veröffentlichen will, dessen Slug fehlt oder unbrauchbar ist.
 *
 * Spiegelt bewusst `astro/src/lib/slug.js` — Studio und Astro sind
 * getrennte npm-Projekte, die Funktion kann nicht geteilt werden. Beide
 * Stellen bei Änderungen gleich halten, sonst bekommt derselbe Titel im
 * Studio und im Frontend zwei verschiedene Adressen.
 */
/* Ein Slug darf genau ein Pfad-Segment sein: keine Schrägstriche, kein
   Doppelpunkt, keine Leerzeichen. Eine eingefügte Web-Adresse
   („https://photos.app.goo.gl/…") fällt hier durch — genau die hat am
   05.08.2026 den kompletten Astro-Build und damit die Live-Site
   lahmgelegt. */
const SAFE_SLUG = /^[a-z0-9](?:[a-z0-9._~-]*[a-z0-9])?$/i;

/** Taugt dieser Slug als Adress-Segment einer Detailseite? */
export function isUsableSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && SAFE_SLUG.test(slug);
}

export function slugify(input: string, maxLength = 96): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // accent-Codes entfernen
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, maxLength);
}
