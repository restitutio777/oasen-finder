/**
 * Sanity-Schemas für WERKstatt Gemeinschaft.
 *
 * Sieben Dokumenttypen entsprechend der -BAR-Architektur:
 * - note     → SchreibBAR (+ DenkBAR via kind: idee/vision/umfrage)
 * - station  → BewegBAR
 * - event    → MachBAR
 * - resource → LesBAR (+ BrauchBAR via kind: konzept/werkzeug)
 * - episode  → HörBAR
 * - about    → erkennBAR (Singleton)
 * - contact  → Mitkommen-Konfiguration (Singleton)
 *
 * Plus i18n-Helfer (Object-Typen):
 * - i18nString — kurzer mehrsprachiger Text (Titel etc.)
 * - i18nText   — Block-Editor für Fließtext
 */
import { i18nString, i18nText } from './i18n';
import { note } from './note';
import { station } from './station';
import { event } from './event';
import { resource } from './resource';
import { episode } from './episode';
import { about } from './about';
import { contact } from './contact';
import { wonder } from './wonder';

export const schemaTypes = [
  // i18n-Helfer zuerst (werden von Document-Schemas referenziert)
  i18nString,
  i18nText,
  // Dokument-Typen
  note,
  station,
  event,
  resource,
  episode,
  wonder,
  about,
  contact,
];
