import { defineField, defineType } from 'sanity';

/**
 * SchreibBAR-Eintrag (+ DenkBAR via kind-Filter).
 * Notizen, Gedichte, Ideen, Visionen, Umfragen — der „Schreibtisch-Stream".
 */
export const note = defineType({
  name: 'note',
  title: 'SchreibBAR — Notiz / Gedicht / Idee',
  type: 'document',
  fields: [
    defineField({
      name: 'publishedAt',
      title: 'Datum',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Slug',
      type: 'slug',
      options: { source: 'title.de', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'i18nString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Art',
      type: 'string',
      options: {
        list: [
          { title: 'Notiz', value: 'notiz' },
          { title: 'Poesie', value: 'poesie' },
          { title: 'Idee (DenkBAR)', value: 'idee' },
          { title: 'Vision (DenkBAR)', value: 'vision' },
          { title: 'Umfrage (DenkBAR)', value: 'umfrage' },
        ],
        layout: 'radio',
      },
      initialValue: 'notiz',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Haupttext',
      type: 'i18nText',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'hero',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'caption', title: 'Bildunterschrift', type: 'i18nString' }),
        defineField({ name: 'alt', title: 'Alt-Text (für Barrierefreiheit)', type: 'i18nString' }),
      ],
    }),
    defineField({
      name: 'mediaLink',
      title: 'Medien-Link (YouTube, Spotify, Apple Music)',
      type: 'url',
    }),
    defineField({
      name: 'pdfAttachment',
      title: 'PDF-Anhang',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
    defineField({
      name: 'externalLink',
      title: 'Externer Link',
      type: 'url',
    }),
    defineField({
      name: 'substackUrl',
      title: 'Substack-Cross-Posting',
      type: 'url',
      description: 'Falls dieser Eintrag auch auf Substack erscheint — Hub-Logik beidseitig',
    }),
  ],
  orderings: [
    {
      title: 'Neueste zuerst',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.de',
      kind: 'kind',
      publishedAt: 'publishedAt',
      media: 'hero',
    },
    prepare({ title, kind, publishedAt, media }) {
      return {
        title: title || '(ohne Titel)',
        subtitle: `${kind || 'notiz'} · ${publishedAt || ''}`,
        media,
      };
    },
  },
});
