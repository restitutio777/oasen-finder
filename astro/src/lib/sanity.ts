/**
 * Sanity-Client für Astro-Pages.
 *
 * Lädt Inhalte zur Build-Zeit (output: 'static' in astro.config.mjs),
 * sodass die fertige Site rein statisch ist — kein Sanity-Round-Trip
 * im Browser, kein Token im Frontend.
 *
 * .env-Variablen werden aus .env.example abgeleitet, sobald das Projekt
 * angelegt ist.
 */
import { createClient, type ClientConfig } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Defaults aus dem produktiven Setup — können via .env überschrieben werden
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'z6eclgt8';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-03-01';

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  /* useCdn MUSS hier false sein (Bug 11.07.): Der Vercel-Build startet
     ~5 Sekunden nach Katharinas Publish (Deploy-Hook) — das API-CDN
     lieferte da noch veraltete Daten. Folge: Der neue lesBAR-Eintrag
     stand zwar in der Liste (eine Query traf frischen Cache), aber
     getStaticPaths bekam ihn nicht (andere Query, alter Cache) → der
     Klick aus der Liste lief die ganze Nacht auf 404. Gleiche Ursache,
     wenn frisch hochgeladene Bilder nach dem Rebuild fehlten.
     Die Site ist statisch, es gibt nur eine Handvoll Queries pro Build —
     api.sanity.io ohne CDN ist immer konsistent-frisch und kostet hier
     praktisch nichts. NICHT zurück auf true stellen. */
  useCdn: false,
};

export const sanity = createClient(config);

const builder = imageUrlBuilder(config);

/**
 * URL für ein Sanity-Bild bauen.
 * Beispiel: urlFor(image).width(1200).quality(80).auto('format').url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Hilfsfunktion: Lokalisierten Text aus i18nString-Objekt holen.
 * Fallback auf Deutsch, wenn die gewählte Sprache nicht ausgefüllt ist.
 */
export type Locale = 'de' | 'fr' | 'en';

export function localized<T>(
  field: { de?: T; fr?: T; en?: T } | undefined | null,
  locale: Locale = 'de',
): T | undefined {
  if (!field) return undefined;
  return field[locale] ?? field.de;
}

/**
 * Projekt ist konfiguriert (z6eclgt8). Lädt seit dem ersten Eintrag
 * im Studio echte Daten. Bevor Inhalte da sind, geben die GROQ-Queries
 * leere Arrays/null zurück und die Pages zeigen ihre Fallback-Hinweise.
 */
export const isSanityConfigured = true;
export const sanityProjectId = projectId;
export const sanityDataset = dataset;

/**
 * Welche Übersetzungen hat ein Beitrag wirklich? (09.09.26)
 *
 * Eine Sprache zählt nur, wenn im Fließtext echte Blöcke mit Text stehen —
 * ein leer aufgeklapptes Studio-Feld ist keine Übersetzung. Genutzt von
 * TranslationLink.astro (Hinweis oben) UND Translations.astro (Text unten),
 * damit beide Stellen nie auseinanderlaufen können.
 */
export interface Translation {
  locale: Exclude<Locale, 'de'>;
  /** Anker-Ziel auf der Seite, z. B. "uebersetzung-en" */
  anchor: string;
  /** Überschrift des Aufklappers */
  heading: string;
  /** Steht in `heading` ein echter übersetzter Titel (statt nur „English version")? */
  hasTitle: boolean;
  /** Einladung oben, in der Zielsprache */
  invitation: string;
  /** Die zu rendernden Blöcke (ggf. ohne die Titelzeile) */
  blocks: any[];
}

const TRANSLATION_LABELS = {
  en: { fallback: 'English version', invitation: 'Also available in English' },
  fr: { fallback: 'Version française', invitation: 'Également disponible en français' },
} as const;

/**
 * Titel einer Übersetzung finden — und aus dem Text entfernen.
 *
 * Katharina füllt das Feld „Titel → English" meist NICHT aus, sondern setzt
 * den übersetzten Titel als FETTE erste Zeile über den Text (so bei
 * „Pancho's Garten", geprüft am 09.09. gegen das Dataset). Genau dieses
 * Signal werten wir aus: fett + erste Zeile = Titel. Er wird dann als
 * Überschrift des Aufklappers gezeigt und aus dem Fließtext entfernt,
 * damit er nicht doppelt dasteht.
 *
 * Bewusst NUR bei „fett": bei Gedichten (z. B. wonder „vertraue") ist die
 * erste Zeile unmarkiert und einfach die erste Verszeile — die darf nicht
 * als Titel missbraucht und schon gar nicht aus dem Gedicht gelöscht werden.
 */
function extractTitleLine(blocks: any[]): { title: string; blocks: any[] } {
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
  // Nur eine einzelne, überschriftartige Zeile — ein ganzer fetter Absatz
  // ist kein Titel und bleibt unangetastet.
  if (!title || title.length > 120) return { title: '', blocks };

  const remainder = rest.join('\n').replace(/^\s*\n/, '');
  const trimmedSpan = { ...span, text: remainder };
  const trimmedFirst = {
    ...first,
    children: remainder
      ? [trimmedSpan, ...first.children.slice(1)]
      : first.children.slice(1),
  };
  // Bleibt vom ersten Block nichts übrig, fällt er ganz weg.
  const rebuilt = trimmedFirst.children.length ? [trimmedFirst, ...blocks.slice(1)] : blocks.slice(1);
  return { title, blocks: rebuilt };
}

/** Enthält das Feld überhaupt sichtbaren Text? */
function hasVisibleText(blocks: any): boolean {
  return (
    Array.isArray(blocks) &&
    blocks.some((b: any) =>
      b?._type === 'image' ||
      b?.children?.some?.((c: any) => typeof c?.text === 'string' && c.text.trim() !== ''),
    )
  );
}

export function availableTranslations(body: any, title?: any): Translation[] {
  return (['en', 'fr'] as const)
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
