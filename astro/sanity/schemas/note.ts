import { defineField, defineType } from 'sanity';
import { ComposeIcon } from '@sanity/icons';
import { docGroups, accentColorField } from './_shared';

/**
 * SchreibBAR-Eintrag (+ DenkBAR via kind-Filter).
 * Notizen, Gedichte, Ideen, Visionen, Umfragen — der „Schreibtisch-Stream".
 */
export const note = defineType({
  name: 'note',
  title: 'SchreibBAR — Notiz / Gedicht / Idee',
  type: 'document',
  icon: ComposeIcon,
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
      name: 'publishedAt',
      title: 'Datum',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule) => Rule.required(),
      group: 'inhalt',
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
      group: 'inhalt',
    }),
    defineField({
      name: 'body',
      title: 'Haupttext',
      type: 'i18nText',
      group: 'inhalt',
    }),
    defineField({
      name: 'tags',
      title: 'Schlagworte',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Tippe ein Wort und drücke Enter. Optional. Beispiele: Kreta, Werkstatt, Pikler.',
      group: 'inhalt',
    }),
    defineField({
      name: 'hero',
      title: 'Hauptbild',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'caption', title: 'Bildunterschrift', type: 'i18nString' }),
        defineField({ name: 'alt', title: 'Alt-Text (für Barrierefreiheit)', type: 'i18nString' }),
      ],
      group: 'medien',
    }),
    defineField({
      name: 'mediaLink',
      title: 'Medien-Link',
      description: 'YouTube, Spotify, Apple Music — wird unter dem Text angezeigt',
      type: 'url',
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
      description: 'Wird automatisch aus dem Titel erzeugt — kannst du ändern',
      type: 'slug',
      options: { source: 'title.de', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: 'mehr',
    }),
    defineField({
      name: 'externalLink',
      title: 'Externer Link',
      type: 'url',
      group: 'mehr',
    }),
    defineField({
      name: 'substackUrl',
      title: 'Substack-Cross-Posting',
      type: 'url',
      description: 'Falls dieser Eintrag auch auf Substack erscheint',
      group: 'mehr',
    }),
    accentColorField,
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
      const kindLabel: Record<string, string> = {
        notiz: 'Notiz',
        poesie: 'Poesie',
        idee: 'Idee',
        vision: 'Vision',
        umfrage: 'Umfrage',
      };
      return {
        title: title || '(ohne Titel)',
        subtitle: `${kindLabel[kind] || 'Notiz'} · ${publishedAt || ''}`,
        media,
      };
    },
  },
});
