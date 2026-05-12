import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
  UserIcon,
  EnvelopeIcon,
  ComposeIcon,
  PinIcon,
  CalendarIcon,
  BookIcon,
  PlayIcon,
} from '@sanity/icons';
import { schemaTypes } from './schemas';

/**
 * Sanity Studio-Konfiguration für WERKstatt Gemeinschaft.
 *
 * Sidebar-Struktur:
 *  - "Über dich": die zwei Singletons (erkennBAR + Mitkommen)
 *  - "Inhalte": die fünf BAR-Bereiche, in der Reihenfolge wie sie auf
 *    der Site auch erscheinen
 *  - Jeder Eintrag hat ein eigenes Icon, damit Katharina auf einen
 *    Blick weiss, wo sie ist
 *
 * Vision-Tool (GROQ-Playground) nur im lokalen Dev-Server — im
 * produktiv-deployten Studio nicht angezeigt, damit Katharina nicht
 * darin stolpert.
 */
export default defineConfig({
  name: 'werkstatt-gemeinschaft',
  title: 'WERKstatt Gemeinschaft',

  // Project: WERKstatt Gemeinschaft
  // Organization: Intuitivmedia (ow7ACwTD3)
  // Plan: Growth Trial — aktuell auf Auftraggeber-Account, Transfer auf
  // Katharina später via Project Settings > Members + Ownership-Transfer
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'z6eclgt8',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalte')
          .items([
            // Persönliche Singletons — oben, in eigener visueller Gruppe
            S.listItem()
              .title('erkennBAR — Über mich')
              .id('about')
              .icon(UserIcon)
              .child(S.document().schemaType('about').documentId('about')),
            S.listItem()
              .title('Mitkommen — Formular-Konfig')
              .id('contact')
              .icon(EnvelopeIcon)
              .child(S.document().schemaType('contact').documentId('contact')),

            S.divider(),

            // BAR-Räume in der Reihenfolge der Site-Navigation
            S.documentTypeListItem('note')
              .title('SchreibBAR — Notizen, Gedichte, Ideen')
              .icon(ComposeIcon),
            S.documentTypeListItem('station')
              .title('BewegBAR — Stationen')
              .icon(PinIcon),
            S.documentTypeListItem('event')
              .title('MachBAR — Werkstatt-Termine')
              .icon(CalendarIcon),
            S.documentTypeListItem('resource')
              .title('LesBAR — Quellen & Werkzeuge')
              .icon(BookIcon),
            S.documentTypeListItem('episode')
              .title('HörBAR — Episoden')
              .icon(PlayIcon),
          ]),
    }),
    // GROQ-Playground für Auftraggeber/Debug — nur lokal, nicht produktiv
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
    // Singletons aus der Create-New-Liste ausblenden
    templates: (templates) =>
      templates.filter(({ schemaType }) => !['about', 'contact'].includes(schemaType)),
  },

  document: {
    // Singletons können nicht dupliziert oder gelöscht werden
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
