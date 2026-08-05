import { defineField, defineType } from 'sanity';
import { ComposeIcon } from '@sanity/icons';
import { docGroups, accentColorField, slugField } from './_shared';

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
  fieldsets: [
    {
      name: 'gedicht',
      title: 'Gedicht-Darstellung',
      description:
        'Nur für Gedichte (Art = „Poesie"). Feinjustierung, wie der Text auf der Seite erscheint — Voreinstellung passt für die meisten Gedichte.',
      options: { collapsible: true, collapsed: false },
    },
  ],
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
      name: 'poemAlign',
      title: 'Ausrichtung',
      type: 'string',
      options: {
        list: [
          { title: 'Linksbündig', value: 'links' },
          { title: 'Zentriert', value: 'zentriert' },
        ],
        layout: 'radio',
      },
      initialValue: 'links',
      group: 'inhalt',
      fieldset: 'gedicht',
      hidden: ({ document }) => document?.kind !== 'poesie',
    }),
    defineField({
      name: 'poemLineSpacing',
      title: 'Zeilenabstand',
      type: 'string',
      options: {
        list: [
          { title: 'Eng', value: 'eng' },
          { title: 'Normal', value: 'normal' },
          { title: 'Weit', value: 'weit' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
      group: 'inhalt',
      fieldset: 'gedicht',
      hidden: ({ document }) => document?.kind !== 'poesie',
    }),
    defineField({
      name: 'poemImageGap',
      title: 'Abstand zum Bild',
      type: 'string',
      options: {
        list: [
          { title: 'Eng', value: 'eng' },
          { title: 'Normal', value: 'normal' },
          { title: 'Weit', value: 'weit' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
      group: 'inhalt',
      fieldset: 'gedicht',
      hidden: ({ document }) => document?.kind !== 'poesie',
    }),
    defineField({
      name: 'poemItalic',
      title: 'Kursiv setzen',
      type: 'boolean',
      description: 'Gibt dem Gedicht einen weicheren, handschriftlicheren Ton.',
      initialValue: false,
      group: 'inhalt',
      fieldset: 'gedicht',
      hidden: ({ document }) => document?.kind !== 'poesie',
    }),
    defineField({
      name: 'tags',
      title: 'Schlagworte',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional. Jeweils ein Wort über den „Hinzufügen"-Button (funktioniert auch am Handy). Beispiele: Kreta, Werkstatt, Pikler.',
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
      title: 'Medien-Link (YouTube / Vimeo / Spotify / Apple Music)',
      description:
        'Einfach die URL einfügen — wird automatisch als Player eingebettet (Video / Musik / Podcast). Telegram-Links werden als Klick-Card angezeigt. Bei anderen URLs erscheint ein klassischer Link.',
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
    slugField({ source: 'title.de', group: 'mehr' }),
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
