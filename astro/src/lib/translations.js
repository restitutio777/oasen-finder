/**
 * Welche Übersetzungen hat ein Beitrag wirklich? (09.09.26)
 *
 * Reines JS ohne Sanity-Client, damit `npm test` die Heuristik prüfen kann
 * (translations.test.js) — sie ist der Teil, der bei ungewohnt eingetippten
 * Inhalten still das Falsche tun könnte.
 *
 * Genutzt von TranslationLink.astro (Hinweis oben) UND Translations.astro
 * (Text unten), damit beide Stellen nie auseinanderlaufen können.
 *
 * @typedef {object} Translation
 * @property {'en'|'fr'} locale
 * @property {string} anchor    Anker-Ziel auf der Seite, z. B. "uebersetzung-en"
 * @property {string} heading   Überschrift des Aufklappers
 * @property {boolean} hasTitle Echter übersetzter Titel (statt nur „English version")?
 * @property {string} invitation Einladung oben, in der Zielsprache
 * @property {any[]} blocks     Zu rendernde Blöcke (ggf. ohne die Titelzeile)
 */

const TRANSLATION_LABELS = {
  en: { fallback: 'English version', invitation: 'Also available in English' },
  fr: { fallback: 'Version française', invitation: 'Également disponible en français' },
};

/** Maximale Länge einer Zeile, die noch als Titel durchgeht. */
const MAX_TITLE_LENGTH = 120;

/**
 * Titel einer Übersetzung finden — und aus dem Text entfernen.
 *
 * Katharina füllt das Feld „Titel → English" praktisch nie aus, sondern setzt
 * den übersetzten Titel als FETTE erste Zeile über den Text (so bei
 * „Pancho's Garten", am 09.09. gegen das Dataset geprüft). Genau dieses Signal
 * werten wir aus: fett + erste Zeile = Titel. Er wird als Überschrift des
 * Aufklappers gezeigt und aus dem Fließtext entfernt, damit er nicht doppelt
 * dasteht.
 *
 * Bewusst NUR bei „fett": bei Gedichten (z. B. wonder „vertraue") ist die
 * erste Zeile unmarkiert und einfach die erste Verszeile — die darf weder als
 * Titel missbraucht noch aus dem Gedicht gelöscht werden.
 *
 * Arbeitet ohne Seiteneffekte: die Blöcke aus Sanity werden nie verändert,
 * nur flach kopiert.
 */
export function extractTitleLine(blocks) {
  const first = blocks[0];
  const span = first?.children?.[0];
  const isBoldOpening =
    first?._type === 'block' &&
    span?._type === 'span' &&
    Array.isArray(span.marks) &&
    span.marks.includes('strong') &&
    typeof span.text === 'string';
  if (!isBoldOpening) return { title: '', blocks };

  const [firstLine, ...rest] = span.text.split('\n');
  const title = firstLine.trim();
  // Ein ganzer fetter Absatz ist kein Titel und bleibt unangetastet.
  if (!title || title.length > MAX_TITLE_LENGTH) return { title: '', blocks };

  const remainder = rest.join('\n');
  const children = remainder
    ? [{ ...span, text: remainder }, ...first.children.slice(1)]
    : first.children.slice(1);
  // Leerzeilen abtragen, die durch das Entfernen der Titelzeile entstehen.
  // Wichtig, weil Titel und Text oft in GETRENNTEN Spans liegen (so bei
  // „Pancho's Garten"): dann bliebe der Umbruch am Anfang des nächsten Spans
  // stehen und träte — wegen pre-line — als Leerzeile in Erscheinung.
  while (children.length && typeof children[0].text === 'string') {
    const trimmed = children[0].text.replace(/^\s*\n+/, '');
    if (trimmed) {
      children[0] = { ...children[0], text: trimmed };
      break;
    }
    children.shift();
  }
  const trimmedFirst = { ...first, children };
  // Bleibt vom ersten Block nichts übrig, fällt er ganz weg.
  const rebuilt = children.length ? [trimmedFirst, ...blocks.slice(1)] : blocks.slice(1);
  return { title, blocks: rebuilt };
}

/**
 * Enthält das Feld überhaupt sichtbaren Inhalt? Ein leer aufgeklapptes
 * Studio-Feld (leere Blöcke ohne Text) ist keine Übersetzung.
 */
export function hasVisibleText(blocks) {
  return (
    Array.isArray(blocks) &&
    blocks.some(
      (b) =>
        b?._type === 'image' ||
        b?.children?.some?.((c) => typeof c?.text === 'string' && c.text.trim() !== ''),
    )
  );
}

/**
 * @param {any} body  i18nText-Objekt ({ de, fr, en })
 * @param {any} [title] i18nString-Objekt mit dem Titel
 * @returns {Translation[]}
 */
export function availableTranslations(body, title) {
  return ['en', 'fr']
    .filter((locale) => hasVisibleText(body?.[locale]))
    .map((locale) => {
      const fromField = typeof title?.[locale] === 'string' ? title[locale].trim() : '';
      const extracted = fromField
        ? { title: '', blocks: body[locale] }
        : extractTitleLine(body[locale]);
      const heading = fromField || extracted.title;
      return {
        locale,
        anchor: `uebersetzung-${locale}`,
        heading: heading || TRANSLATION_LABELS[locale].fallback,
        hasTitle: Boolean(heading),
        invitation: TRANSLATION_LABELS[locale].invitation,
        blocks: extracted.blocks,
      };
    });
}
