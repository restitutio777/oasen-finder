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

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-03-01';

const config: ClientConfig = {
  projectId: projectId || 'PROJECT_ID_PLACEHOLDER',
  dataset,
  apiVersion,
  // Lese-Zugriff via CDN — schnell + kostenfrei für public datasets
  useCdn: true,
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
 * Flag, ob Sanity tatsächlich konfiguriert ist (für graceful degradation
 * solange das Projekt noch nicht aufgesetzt ist).
 */
export const isSanityConfigured = projectId && projectId !== 'PROJECT_ID_PLACEHOLDER';
