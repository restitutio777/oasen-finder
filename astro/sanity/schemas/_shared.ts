import { defineField } from 'sanity';
import { isUsableSlug } from '../lib/slugify';

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
 * Das Adress-Feld (Slug) — für alle Doc-Types gleich.
 *
 * Hieß bis 05.08.2026 „URL-Adresse". Der Name hat eingeladen, genau das
 * Falsche hineinzuschreiben: In einer Notiz landete ein Google-Photos-Link
 * darin, Astro konnte daraus keinen Dateipfad mehr bauen, der Vercel-Build
 * scheiterte — und die Live-Site blieb tagelang auf altem Stand stehen,
 * während im Studio alles veröffentlicht aussah.
 *
 * Drei Sicherungen greifen seither ineinander:
 *   1. Titel + Beschreibung sagen deutlich, dass hier KEIN Link hingehört.
 *   2. Diese Validierung meldet eine unbrauchbare Adresse sichtbar —
 *      bewusst als Warnung, nicht als Fehler: Ein blockierter
 *      „Veröffentlichen"-Button fühlt sich am Handy wie ein kaputtes
 *      Backend an, und Punkt 3 räumt ohnehin auf.
 *   3. Die AutoSlugPublishAction bildet beim Veröffentlichen eine saubere
 *      Adresse aus dem Titel und sagt per Toast Bescheid.
 * Zusätzlich fängt das Frontend (astro/src/lib/slug.js) den Fall ab, damit
 * ein einzelner Eintrag nie wieder die ganze Site mitreißen kann.
 */
export function slugField({ source, group }: { source: string; group?: string }) {
  return defineField({
    name: 'slug',
    title: 'Adresse dieser Seite',
    description:
      'Der letzte Teil der Web-Adresse — z. B. „vom-lebensfluss-getragen". ' +
      'Wird beim Veröffentlichen automatisch aus dem Titel gebildet, du musst hier nichts eintragen. ' +
      'Kein Feld für Links: Adressen zu Fotos, Videos oder anderen Seiten gehören in „Externer Link" bzw. „Medien-Link".',
    type: 'slug',
    options: { source, maxLength: 96 },
    validation: (Rule) =>
      Rule.custom((value?: { current?: string }) => {
        const current = value?.current;
        // Leer ist in Ordnung — beim Veröffentlichen wird die Adresse gesetzt.
        if (!current) return true;
        if (!isUsableSlug(current)) {
          return (
            'Hier gehört nur der Adress-Teil hin, keine ganze Web-Adresse — ' +
            'also z. B. „vom-lebensfluss-getragen" statt „https://…". ' +
            'Links auf Fotos oder Videos gehören in „Externer Link" bzw. „Medien-Link". ' +
            'Am einfachsten: dieses Feld leeren — beim Veröffentlichen wird die Adresse automatisch gesetzt.'
          );
        }
        return true;
      }).warning(),
    ...(group ? { group } : {}),
  });
}

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
