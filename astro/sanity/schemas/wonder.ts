import { defineField, defineType } from 'sanity';
import { SparkleIcon } from '@sanity/icons';
import { docGroups, accentColorField } from './_shared';

/**
 * wunderBAR-Eintrag — Kreatives, Spielerisches, Off-Topic.
 *
 * Der Ort für alles, was nicht in die anderen Räume passt:
 * Wortspiele, Skizzen, ungewöhnliche Beobachtungen, Experimente,
 * Witziges, Ungeordnetes. Eine bewusst lose Sammlung — keine feste
 * Form, keine festen Themen.
 */
export const wonder = defineType({
  name: 'wonder',
  title: 'wunderBAR — Kreatives & Off-Topic',
  type: 'document',
  icon: SparkleIcon,
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
      description: 'Optional — z.B. „Spiel", „Skizze", „Frage", „Witz"',
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
        'Einfach die URL einfügen — wird automatisch als Player eingebettet. Telegram-Links als Klick-Card.',
      type: 'url',
      group: 'medien',
    }),
    defineField({
      name: 'pdfAttachment',
      title: 'Dokument-Anhang',
      description: 'PDF, Word (.doc/.docx), OpenDocument (.odt) oder reiner Text (.txt)',
      type: 'file',
      options: {
        accept:
          'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,text/plain',
      },
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
      publishedAt: 'publishedAt',
      media: 'hero',
    },
    prepare({ title, publishedAt, media }) {
      return {
        title: title || '(ohne Titel)',
        subtitle: publishedAt || '',
        media,
      };
    },
  },
});
