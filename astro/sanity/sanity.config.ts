import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import {
  UserIcon,
  EnvelopeIcon,
  ComposeIcon,
  PinIcon,
  CalendarIcon,
  BookIcon,
  PlayIcon,
  SparkleIcon,
} from '@sanity/icons';
import { schemaTypes } from './schemas';
import { AutoSlugPublishAction } from './actions/AutoSlugPublishAction';

/**
 * Sanity Studio-Konfiguration für werkSTATT Gemeinschaft.
 *
 * Zwei Tools nebeneinander:
 *  - "Inhalte" (structureTool): klassischer Editor mit Sidebar
 *  - "Vorschau" (presentationTool): Live-iframe der Site mit Doc-Selector
 *    daneben. Klick auf einen Inhalt im Iframe öffnet das Sanity-Doc.
 *    Bei "Publish" → Iframe refresht nach 60-90 s (Vercel-Build-Zeit).
 *    Hinweis: Drafts (ungespeicherte Bearbeitungen) werden im Iframe
 *    NICHT live gezeigt — dafür braucht's einen SSR-Adapter. Workflow:
 *    Edit → Publish → Reload-Klick → neue Version sichtbar.
 *
 * Vision-Tool (GROQ-Playground) nur im lokalen Dev-Server.
 */

const SITE_URL = 'https://oasen-finder.vercel.app';

export default defineConfig({
  name: 'werkstatt-gemeinschaft',
  title: 'werkSTATT Gemeinschaft',

  // Project: werkSTATT Gemeinschaft
  // Organization: Intuitivmedia (ow7ACwTD3)
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'z6eclgt8',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalte')
          .items([
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

            S.documentTypeListItem('note')
              .title('schreibBAR — Notizen, Gedichte, Ideen')
              .icon(ComposeIcon),
            S.documentTypeListItem('station')
              .title('bewegBAR — Stationen')
              .icon(PinIcon),
            S.documentTypeListItem('event')
              .title('machBAR — Werkstatt-Termine')
              .icon(CalendarIcon),
            S.documentTypeListItem('resource')
              .title('lesBAR — Quellen & Werkzeuge')
              .icon(BookIcon),
            S.documentTypeListItem('episode')
              .title('hörBAR — Episoden')
              .icon(PlayIcon),
            S.documentTypeListItem('wonder')
              .title('wunderBAR — Kreatives & Off-Topic')
              .icon(SparkleIcon),
          ]),
    }),

    /**
     * Presentation Tool — live-iframe der Site mit Doc-Resolvern pro Type.
     * Erscheint als zweiter Top-Level-Tab "Vorschau" neben "Inhalte".
     */
    presentationTool({
      title: 'Vorschau',
      previewUrl: SITE_URL,
      resolve: {
        locations: {
          note: defineLocations({
            select: { title: 'title.de', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || 'Notiz', href: `/schreibbar/${doc?.slug || ''}/` },
                { title: 'Alle Notizen', href: '/schreibbar/' },
              ],
            }),
          }),
          station: defineLocations({
            select: { name: 'name', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.name || 'Station', href: `/bewegbar/${doc?.slug || ''}/` },
                { title: 'Alle Stationen', href: '/bewegbar/' },
              ],
            }),
          }),
          event: defineLocations({
            select: { title: 'title.de', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || 'Termin', href: `/machbar/${doc?.slug || ''}/` },
                { title: 'Alle Termine', href: '/machbar/' },
              ],
            }),
          }),
          resource: defineLocations({
            select: { title: 'title.de', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || 'Quelle', href: `/lesbar/${doc?.slug || ''}/` },
                { title: 'Bibliothek', href: '/lesbar/' },
              ],
            }),
          }),
          episode: defineLocations({
            select: { title: 'title.de', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || 'Episode', href: `/hoerbar/${doc?.slug || ''}/` },
                { title: 'Alle Episoden', href: '/hoerbar/' },
              ],
            }),
          }),
          wonder: defineLocations({
            select: { title: 'title.de', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || 'wunderBAR-Eintrag', href: `/wunderbar/${doc?.slug || ''}/` },
                { title: 'Alle wunderBAR-Einträge', href: '/wunderbar/' },
              ],
            }),
          }),
          about: defineLocations({
            select: {},
            resolve: () => ({
              locations: [{ title: 'erkennBAR — Über Katharina', href: '/erkennbar/' }],
            }),
          }),
          contact: defineLocations({
            select: {},
            resolve: () => ({
              locations: [{ title: 'Mitkommen — Kontakt-Formular', href: '/mitkommen/' }],
            }),
          }),
        },
      },
    }),

    // GROQ-Playground für Auftraggeber/Debug — nur lokal, nicht produktiv
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !['about', 'contact'].includes(schemaType)),
  },

  document: {
    actions: (input, context) => {
      // Singletons können nicht dupliziert oder gelöscht werden
      if (['about', 'contact'].includes(context.schemaType)) {
        return input.filter(
          ({ action }) => action && !['duplicate', 'delete'].includes(action),
        );
      }

      // Für alle Doc-Types mit Slug: Standard-Publish durch
      // AutoSlugPublishAction ersetzen — generiert den Slug aus dem
      // Titel, falls Katharina ihn nicht selbst gesetzt hat.
      const docTypesWithSlug = [
        'note',
        'station',
        'event',
        'resource',
        'episode',
        'wonder',
      ];
      if (docTypesWithSlug.includes(context.schemaType)) {
        return input.map((action) =>
          action.action === 'publish' ? AutoSlugPublishAction : action,
        );
      }

      return input;
    },
  },
});
