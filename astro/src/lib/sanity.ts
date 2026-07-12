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
