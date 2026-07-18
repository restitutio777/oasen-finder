import { defineField, defineType } from 'sanity';
import { PlayIcon } from '@sanity/icons';

/**
 * HörBAR-Episode — eingesprochene Reflexion, Gedicht, Lied, oder Gespräch.
 * Bindings: YouTube, Spotify, Apple Music.
 */
export const episode = defineType({
  name: 'episode',
  title: 'HörBAR — Episode',
  type: 'document',
  icon: PlayIcon,
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
      title: 'URL-Adresse',
      description: 'Wird beim Veröffentlichen automatisch aus dem Titel generiert — du kannst sie hier auch eigenständig setzen, wenn du möchtest.',
      type: 'slug',
      options: { source: 'title.de', maxLength: 96 },
    }),
    defineField({
      name: 'kind',
      title: 'Art',
      description: 'Wird auf der Website als Kennzeichnung angezeigt — wie Notiz/Poesie in der schreibBAR.',
      type: 'string',
      options: {
        list: [
          { title: 'Gespräch', value: 'gespraech' },
          { title: 'Vortrag', value: 'vortrag' },
          { title: 'Gedicht', value: 'gedicht' },
          { title: 'Lied', value: 'lied' },
          { title: 'Reflexion', value: 'reflexion' },
        ],
        layout: 'radio',
      },
      initialValue: 'reflexion',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Plattform',
      description: 'Wenn die Folge auf YouTube/Spotify/Apple Music liegt, wähle die Plattform. Wenn du die Audio-Datei direkt in Sanity hochlädst (unten), kann das hier auf „Direkt-Upload" stehen.',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Spotify', value: 'spotify' },
          { title: 'Apple Music', value: 'applemusic' },
          { title: 'Direkt-Upload (Audio in Sanity)', value: 'direkt' },
          { title: 'Sonstige', value: 'sonstige' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL zur Folge',
      description: 'Bei externen Plattformen Pflicht. Bei „Direkt-Upload" kannst du es leer lassen.',
      type: 'url',
    }),
    defineField({
      name: 'audioFile',
      title: 'Audio-Datei (Direkt-Upload)',
      description: 'Alternative zur externen URL: lade hier eine MP3/M4A/WAV/OGG hoch. Die Site zeigt dann einen eigenen Player im Brand-Look — Besucher hören direkt auf der Seite, ohne Plattform-Cookies.',
      type: 'file',
      options: { accept: 'audio/mpeg,audio/mp4,audio/m4a,audio/wav,audio/ogg,audio/x-m4a' },
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
      title: 'Transkript',
      description: 'PDF, Word (.doc/.docx), OpenDocument (.odt) oder reiner Text (.txt)',
      type: 'file',
      options: { accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,text/plain' },
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
      platform: 'platform',
      publishedAt: 'publishedAt',
      number: 'episodeNumber',
      media: 'cover',
    },
    prepare({ title, kind, platform, publishedAt, number, media }) {
      const kindLabel: Record<string, string> = {
        gespraech: 'Gespräch',
        vortrag: 'Vortrag',
        gedicht: 'Gedicht',
        lied: 'Lied',
        reflexion: 'Reflexion',
      };
      return {
        title: number ? `#${number} — ${title || '(ohne Titel)'}` : title || '(ohne Titel)',
        subtitle: [kindLabel[kind], platform, publishedAt].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
