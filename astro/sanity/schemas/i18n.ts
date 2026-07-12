import { defineType, defineField, defineArrayMember } from 'sanity';

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
/**
 * Bausteine des Fließtexts: Absätze + Bilder.
 *
 * Bilder direkt im Text (12.07., Katharinas Wunsch): Im Editor über das
 * „+" zwischen zwei Absätzen (oder das Bild-Symbol in der Werkzeugleiste)
 * ein Bild einfügen — es erscheint auf der Webseite genau an dieser Stelle
 * im Text. Gerendert von PortableText.astro (types.image).
 */
const textBlocks = [
  defineArrayMember({ type: 'block' }),
  defineArrayMember({
    type: 'image',
    title: 'Bild',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'caption',
        title: 'Bildunterschrift (optional)',
        type: 'string',
        description: 'Erscheint klein unter dem Bild — und hilft Menschen, die das Bild nicht sehen können.',
      }),
    ],
  }),
];

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
      of: textBlocks,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: textBlocks,
      fieldset: 'translations',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: textBlocks,
      fieldset: 'translations',
    }),
  ],
});
