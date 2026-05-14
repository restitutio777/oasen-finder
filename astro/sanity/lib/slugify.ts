/**
 * Slug-Generator für deutsche Titel.
 *
 * Beispiele:
 *   "Frühjahr auf Kreta"     → "fruehjahr-auf-kreta"
 *   "Café & mehr!"            → "cafe-mehr"
 *   "Tempelhof, Hohenlohe"    → "tempelhof-hohenlohe"
 *
 * Wird in der AutoSlugPublishAction aufgerufen, wenn Katharina ein
 * Dokument veröffentlichen will, das keinen Slug gesetzt hat.
 */
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
