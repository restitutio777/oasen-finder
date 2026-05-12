import { defineField, defineType } from 'sanity';

/**
 * HörBAR-Episode — eingesprochene Reflexion, Gedicht, Lied, oder Gespräch.
 * Bindings: YouTube, Spotify, Apple Music.
 */
export const episode = defineType({
  name: 'episode',
  title: 'HörBAR — Episode',
  type: 'document',
  fields: [
    defineField({
      name: 'episodeNumber',
      title: 'Folge-Nummer',
      type: 'number',
    }),
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
      name: 'platform',
      title: 'Plattform',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Spotify', value: 'spotify' },
          { title: 'Apple Music', value: 'applemusic' },
          { title: 'Sonstige', value: 'sonstige' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL zur Folge',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlichungsdatum',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: 'summary',
      title: 'Kurz-Beschreibung',
      type: 'i18nText',
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'transcriptPdf',
      title: 'Transkript (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
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
      platform: 'platform',
      publishedAt: 'publishedAt',
      number: 'episodeNumber',
      media: 'cover',
    },
    prepare({ title, platform, publishedAt, number, media }) {
      return {
        title: number ? `#${number} — ${title || '(ohne Titel)'}` : title || '(ohne Titel)',
        subtitle: [platform, publishedAt].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
