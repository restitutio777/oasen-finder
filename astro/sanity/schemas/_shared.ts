import { defineField } from 'sanity';

/**
 * Geteilte Schema-Bausteine für alle BAR-Dokumente.
 *
 * Halten das Studio über Bereiche hinweg konsistent: dieselben Tabs,
 * dieselbe Akzentfarben-Logik, gleiche Hilfetexte.
 */

/**
 * Drei Tabs für jedes größere Dokument:
 *  - Inhalt: Titel, Datum, Text, Tags (= Default-Tab)
 *  - Bilder & Anhänge: Fotos, PDFs, Cover
 *  - Mehr: URL-Slug, externe Links, Akzentfarbe
 *
 * Katharina sieht beim Öffnen eines Eintrags nur die wichtigen Felder,
 * der Rest sitzt in „Mehr" und ist trotzdem da, wenn sie ihn braucht.
 */
export const docGroups = [
  { name: 'inhalt', title: 'Inhalt', default: true },
  { name: 'medien', title: 'Bilder & Anhänge' },
  { name: 'mehr', title: 'Mehr' },
] as const;

/**
 * Optionales Akzentfarben-Feld.
 * Wenn gesetzt, kann das Frontend die Farbe als Stripe / Marker rendern.
 * Werte sind die Brand-Tokens aus global.css (CSS-Custom-Properties).
 * "" = kein eigener Akzent → Standard-Honig-Gold wird genutzt.
 */
export const accentColorField = defineField({
  name: 'accentColor',
  title: 'Akzentfarbe (optional)',
  description:
    'Markiert den Eintrag mit einer Farbe in der Übersicht. Leer lassen, wenn Standard genügt.',
  type: 'string',
  options: {
    list: [
      { title: '— kein eigener Akzent —', value: '' },
      { title: 'Honig-Gold (Standard)', value: 'gold' },
      { title: 'Warm-Gold', value: 'warm' },
      { title: 'Clay-Rot', value: 'clay' },
      { title: 'Fern-Grün', value: 'fern' },
      { title: 'Aubergine', value: 'aubergine' },
      { title: 'Sage', value: 'sage' },
    ],
    layout: 'radio',
  },
  initialValue: '',
  group: 'mehr',
});
