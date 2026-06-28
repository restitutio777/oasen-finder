import { defineField, defineType } from 'sanity';
import { BookIcon } from '@sanity/icons';
import { docGroups, accentColorField } from './_shared';

/**
 * LesBAR-Eintrag (+ BrauchBAR via kind-Filter).
 * Bücher, Webseiten, Filme, Podcasts, Gespräche, plus Konzepte/Werkzeuge.
 */
export const resource = defineType({
  name: 'resource',
  title: 'LesBAR — Quelle / Werkzeug',
  type: 'document',
  icon: BookIcon,
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
      initialValue: 'buch',
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
      title: 'Dokument-Anhang',
      description: 'PDF, Word (.doc/.docx), OpenDocument (.odt) oder reiner Text (.txt)',
      type: 'file',
      options: { accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,text/plain' },
      group: 'medien',
    }),
    defineField({
      name: 'slug',
      title: 'URL-Adresse',
      description: 'Wird beim Veröffentlichen automatisch aus dem Titel generiert — du kannst sie hier auch eigenständig setzen, wenn du möchtest.',
      type: 'slug',
      options: { source: 'title.de', maxLength: 96 },
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
      const kindLabel: Record<string, string> = {
        buch: 'Buch',
        webseite: 'Webseite',
        aufsatz: 'Aufsatz',
        film: 'Film',
        podcast: 'Podcast',
        gespraech: 'Gespräch',
        konzept: 'Konzept (brauchBAR)',
        werkzeug: 'Werkzeug (brauchBAR)',
      };
      return {
        title: title || '(ohne Titel)',
        subtitle: [kindLabel[kind] || kind, authorOrSource].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
