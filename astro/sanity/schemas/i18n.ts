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
 * Custom block-Type für Fließtext mit:
 *  - Standard-Decorators (Fett, Kursiv, etc.)
 *  - Externe Links (URL)
 *  - Erwähnungen (Reference auf einen Person-Eintrag)
 *
 * Die Erwähnung ist Sanitys Way, im Text auf eine andere Entität
 * zu zeigen — z.B. "Ich habe Anna in Tempelhof getroffen", wo
 * "Anna" als Erwähnung markiert wird und zur Person-Detail-Seite
 * (bzw. zu deren Haupt-Link) führt.
 */
const richBlock = {
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Überschrift', value: 'h2' },
    { title: 'Unter-Überschrift', value: 'h3' },
    { title: 'Zitat', value: 'blockquote' },
  ],
  lists: [
    { title: 'Aufzählung', value: 'bullet' },
    { title: 'Nummeriert', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Fett', value: 'strong' },
      { title: 'Kursiv', value: 'em' },
      { title: 'Code', value: 'code' },
      { title: 'Unterstrichen', value: 'underline' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Externer Link',
        fields: [
          {
            name: 'href',
            type: 'url',
            title: 'URL',
            validation: (Rule: any) =>
              Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
          },
          {
            name: 'openInNewTab',
            type: 'boolean',
            title: 'In neuem Tab öffnen',
            initialValue: true,
          },
        ],
      },
      {
        name: 'mention',
        type: 'object',
        title: 'Mensch erwähnen',
        // Sanity-UI: nach dem Markieren erscheint dieser Dialog
        fields: [
          {
            name: 'target',
            type: 'reference',
            title: 'Wen erwähnen?',
            to: [{ type: 'person' }],
            description:
              'Wähle einen vorhandenen Eintrag. Neuen Menschen kannst du oben links unter "Menschen" anlegen.',
          },
        ],
      },
    ],
  },
};

/**
 * Lokalisierter Fließtext mit Block-Editor.
 * Nutzt das custom richBlock — also mit Mention-Annotation und
 * deutschen Decorator-Labels.
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
      of: [richBlock as any],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: [richBlock as any],
      fieldset: 'translations',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [richBlock as any],
      fieldset: 'translations',
    }),
  ],
});
