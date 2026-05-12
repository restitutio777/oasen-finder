import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

/**
 * Sanity Studio-Konfiguration für WERKstatt Gemeinschaft.
 *
 * Bevor das Studio läuft, müssen PROJECT_ID + DATASET ergänzt werden —
 * siehe README.md, Abschnitt "Sanity-Setup".
 *
 * Studio wird via `pnpm sanity:dev` lokal gestartet (Port 3333) und
 * via `pnpm sanity:deploy` ins Sanity-Cloud-Hosting deployt
 * (https://werkstatt-gemeinschaft.sanity.studio o.ä.).
 */
export default defineConfig({
  name: 'werkstatt-gemeinschaft',
  title: 'WERKstatt Gemeinschaft',

  // Project: WERKstatt Gemeinschaft
  // Organization: Intuitivmedia (ow7ACwTD3)
  // Plan: Growth Trial — aktuell auf Auftraggeber-Account, Transfer auf
  // Katharina später via Project Settings > Members + Ownership-Transfer
  // (siehe README.md > "Setup-Strategie für späteren Transfer")
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'z6eclgt8',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalte')
          .items([
            // Singletons separat zeigen — Katharina sieht nur EIN about/contact-Dokument
            S.listItem()
              .title('erkennBAR — Über mich')
              .id('about')
              .child(
                S.document().schemaType('about').documentId('about'),
              ),
            S.listItem()
              .title('Mitkommen — Formular-Konfig')
              .id('contact')
              .child(
                S.document().schemaType('contact').documentId('contact'),
              ),
            S.divider(),
            // Reguläre Listen-Typen
            S.documentTypeListItem('note').title('SchreibBAR — Notizen, Gedichte, Ideen'),
            S.documentTypeListItem('station').title('BewegBAR — Stationen'),
            S.documentTypeListItem('event').title('MachBAR — Werkstatt-Termine'),
            S.documentTypeListItem('resource').title('LesBAR — Quellen & Werkzeuge'),
            S.documentTypeListItem('episode').title('HörBAR — Episoden'),
          ]),
    }),
    visionTool(), // GROQ-Playground für Debugging
  ],

  schema: {
    types: schemaTypes,
    // Singletons aus der Create-New-Liste ausblenden
    templates: (templates) =>
      templates.filter(({ schemaType }) => !['about', 'contact'].includes(schemaType)),
  },

  document: {
    // Singletons können nicht dupliziert werden
    actions: (input, context) => {
      if (['about', 'contact'].includes(context.schemaType)) {
        return input.filter(
          ({ action }) => action && !['duplicate', 'delete'].includes(action),
        );
      }
      return input;
    },
  },
});
