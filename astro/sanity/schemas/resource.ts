import { defineField, defineType } from 'sanity';
import { docGroups, accentColorField } from './_shared';

/**
 * LesBAR-Eintrag (+ BrauchBAR via kind-Filter).
 * Bücher, Webseiten, Filme, Podcasts, Gespräche, plus Konzepte/Werkzeuge.
 */
export const resource = defineType({
  name: 'resource',
  title: 'LesBAR — Quelle / Werkzeug',
  type: 'document',
  groups: [...docGroups],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'i18nString',
      validation: (Rule) => Rule.required(),
      group: 'inhalt',
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
      group: 'inhalt',
    }),
    defineField({
      name: 'authorOrSource',
      title: 'Autor / Quelle',
      type: 'string',
      group: 'inhalt',
    }),
    defineField({
      name: 'note',
      title: 'Deine Notiz — warum hier?',
      type: 'i18nText',
      description: 'Was bringt es dir, was bringt es Besuchern',
      group: 'inhalt',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      group: 'inhalt',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover / Bild',
      type: 'image',
      options: { hotspot: true },
      group: 'medien',
    }),
    defineField({
      name: 'pdfAttachment',
      title: 'PDF-Anhang',
      type: 'file',
      options: { accept: 'application/pdf' },
      group: 'medien',
    }),
    defineField({
      name: 'slug',
      title: 'URL-Adresse',
      description: 'Wird automatisch aus dem Titel erzeugt — kannst du ändern',
      type: 'slug',
      options: { source: 'title.de', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: 'mehr',
    }),
    accentColorField,
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
