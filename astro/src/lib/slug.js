/**
 * Slug-Absicherung fürs Frontend.
 *
 * Hintergrund (Bug 05.08.2026): In einem schreibBAR-Eintrag stand ein
 * Google-Photos-Link im Feld „URL-Adresse" (= slug). Astro baut aus dem
 * Slug den Dateipfad der Detailseite; ein Slug mit Schrägstrichen lässt
 * getStaticPaths mit „Missing parameter: slug" abbrechen — und reißt
 * damit den GESAMTEN Build mit. Folge: Der Vercel-Deploy scheiterte bei
 * jedem Publish, die Site blieb wochenlang auf dem Stand des letzten
 * erfolgreichen Builds stehen, und alles neu Veröffentlichte war
 * unsichtbar. Genau das Symptom, das Katharina gemeldet hat.
 *
 * Regel seither: Kein Slug aus Sanity geht ungeprüft in eine Route.
 * Ist er unbrauchbar, wird er aus dem Titel neu gebildet — der Eintrag
 * erscheint dann unter einer sauberen Adresse, statt die ganze Site
 * lahmzulegen. Im Studio verhindert zusätzlich eine Validierung
 * (sanity/schemas/_shared.ts), dass so ein Slug überhaupt gespeichert
 * werden kann.
 *
 * `toSlug()` spiegelt bewusst `sanity/lib/slugify.ts` — Studio und
 * Astro sind getrennte npm-Projekte, die Funktion kann nicht geteilt
 * werden. Beide Stellen bei Änderungen gleich halten, sonst bekommt
 * derselbe Titel im Studio und im Frontend zwei verschiedene Adressen.
 */

/* Ein Slug darf genau ein Pfad-Segment sein: keine Schrägstriche, kein
   Doppelpunkt, keine Leerzeichen, kein Fragezeichen/Raute. Erlaubt sind
   die URL-unreservierten Zeichen; Anfang und Ende müssen alphanumerisch
   sein, damit weder „-" noch „." allein am Rand stehen. */
const SAFE_SLUG = /^[a-z0-9](?:[a-z0-9._~-]*[a-z0-9])?$/i;

/** Taugt dieser Slug als Adress-Segment einer Detailseite? */
export function isUsableSlug(slug) {
  return typeof slug === 'string' && SAFE_SLUG.test(slug);
}

/** Deutschen Titel in einen Slug übersetzen (wie im Studio). */
export function toSlug(input, maxLength = 96) {
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

/**
 * Verwendbaren Slug liefern — den aus Sanity, wenn er taugt, sonst
 * einen aus dem Titel gebildeten. `null`, wenn beides nichts hergibt
 * (dann hat der Eintrag keine verlinkbare Adresse und wird übersprungen).
 *
 * @param {unknown} slug Slug aus Sanity (slug.current)
 * @param {unknown} fallbackTitle Titel/Name des Eintrags
 * @returns {string | null}
 */
export function safeSlug(slug, fallbackTitle) {
  if (isUsableSlug(slug)) return slug;
  const derived = toSlug(typeof fallbackTitle === 'string' ? fallbackTitle : '');
  return isUsableSlug(derived) ? derived : null;
}

/**
 * Sanity-Einträge fürs Verlinken vorbereiten: `slug` durch einen
 * garantiert verwendbaren ersetzen, Einträge ohne verlinkbare Adresse
 * weglassen, doppelte Adressen einmalig halten (zwei Seiten unter
 * derselben URL wären wieder ein Build-Fehler).
 *
 * Muss auf Listen- UND Detailseite gleich laufen, sonst zeigt die Liste
 * auf eine Adresse, die es nicht gibt. Deshalb überall diese eine
 * Funktion benutzen statt `slug.current` direkt.
 *
 * @template {{ slug?: unknown }} T
 * @param {T[] | null | undefined} items
 * @param {(item: T) => unknown} titleOf Titel-Quelle für den Ersatz-Slug
 * @returns {(T & { slug: string })[]}
 */
export function withSafeSlugs(items, titleOf = (item) => item?.title?.de) {
  const seen = new Set();
  const out = [];
  for (const item of items ?? []) {
    const slug = safeSlug(item?.slug, titleOf(item));
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push({ ...item, slug });
  }
  return out;
}
