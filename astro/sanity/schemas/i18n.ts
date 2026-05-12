import { defineType, defineField } from 'sanity';

/**
 * Lokalisierter Kurztext (Titel, Eyebrows, Labels).
 *
 * Deutsch ist Pflichtfeld, Französisch und Englisch optional.
 */
export const i18nString = defineType({
  name: 'i18nString',
  title: 'Mehrsprachiger Text (kurz)',
  type: 'object',
  fieldsets: [
    {
      name: 'translations',
      title: 'Übersetzungen (optional)',
      description:
        'Französisch und Englisch sind optional. Leer lassen ist okay — die Seite zeigt dann automatisch den deutschen Text.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'de',
      title: 'Deutsch',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'string',
      fieldset: 'translations',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      fieldset: 'translations',
    }),
  ],
});

/**
 * Lokalisierter Fließtext (mit Block-Editor).
 *
 * Sanity bietet standardmäßig:
 *  - Decorators: Fett, Kursiv, Code, Unterstrichen, Durchgestrichen
 *  - Annotation: externer Link (Wort markieren → Link-Icon → URL eintippen)
 *
 * Das reicht für 99 % der Verlinkungen. Für YouTube/Vimeo/Spotify
 * gibt's pro Beitrag ein dediziertes „Medien-Link"-Feld
 * (siehe note.mediaLink etc.) — wird automatisch als Player eingebettet.
 */
export const i18nText = defineType({
  name: 'i18nText',
  title: 'Mehrsprachiger Fließtext',
  type: 'object',
  fieldsets: [
    {
      name: 'translations',
      title: 'Übersetzungen (optional)',
      description:
        'Französisch und Englisch sind optional. Leer lassen ist okay — die Seite zeigt dann automatisch den deutschen Text.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'de',
      title: 'Deutsch',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: [{ type: 'block' }],
      fieldset: 'translations',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
      fieldset: 'translations',
    }),
  ],
});
