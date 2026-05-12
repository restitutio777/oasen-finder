import { defineField, defineType } from 'sanity';

/**
 * LesBAR-Eintrag (+ BrauchBAR via kind-Filter).
 * Bücher, Webseiten, Filme, Podcasts, Gespräche, plus Konzepte/Werkzeuge.
 */
export const resource = defineType({
  name: 'resource',
  title: 'LesBAR — Quelle / Werkzeug',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'i18nString',
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
      name: 'kind',
      title: 'Art',
      type: 'string',
      options: {
        list: [
          { title: 'Buch', value: 'buch' },
          { title: 'Webseite', value: 'webseite' },
          { title: 'Aufsatz / Artikel', value: 'aufsatz' },
          { title: 'Film', value: 'film' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'Gespräch', value: 'gespraech' },
          { title: 'Konzept (BrauchBAR)', value: 'konzept' },
          { title: 'Werkzeug (BrauchBAR)', value: 'werkzeug' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorOrSource',
      title: 'Autor / Quelle',
      type: 'string',
    }),
    defineField({
      name: 'note',
      title: 'Deine Notiz — warum hier?',
      type: 'i18nText',
      description: 'Was bringt es dir, was bringt es Besuchern',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover / Bild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'pdfAttachment',
      title: 'PDF-Anhang',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
  ],
  preview: {
    select: {
      title: 'title.de',
      kind: 'kind',
      authorOrSource: 'authorOrSource',
      media: 'coverImage',
    },
    prepare({ title, kind, authorOrSource, media }) {
      return {
        title: title || '(ohne Titel)',
        subtitle: [kind, authorOrSource].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
