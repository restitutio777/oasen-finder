import { defineField, defineType } from 'sanity';
import { CalendarIcon } from '@sanity/icons';
import { accentColorField } from './_shared';

/**
 * MachBAR-Event — Werkstatt-Termin.
 * Mit Saison-Filter (Katharinas Jahres-Rhythmus) und Hundefreundlich-Flag (Carla).
 */
export const event = defineType({
  name: 'event',
  title: 'MachBAR — Werkstatt-Termin',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'inhalt', title: 'Inhalt', default: true },
    { name: 'anmeldung', title: 'Anmeldung & Kosten' },
    { name: 'medien', title: 'Bilder & Anhänge' },
    { name: 'mehr', title: 'Mehr' },
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
      name: 'startDate',
      title: 'Datum / Beginn',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      group: 'inhalt',
    }),
    defineField({
      name: 'endDate',
      title: 'Ende (falls mehrtägig)',
      type: 'datetime',
      group: 'inhalt',
    }),
    defineField({
      name: 'ownership',
      title: 'Eigene oder fremde Werkstatt?',
      type: 'string',
      options: {
        list: [
          { title: 'Eigener Termin', value: 'eigener' },
          { title: 'Mit-Termin bei befreundetem Haus', value: 'fremder' },
        ],
        layout: 'radio',
      },
      initialValue: 'eigener',
      validation: (Rule) => Rule.required(),
      group: 'inhalt',
    }),
    defineField({
      name: 'season',
      title: 'Saison',
      type: 'string',
      options: {
        list: [
          { title: 'Winter (Verdauen)', value: 'winter' },
          { title: 'Frühjahr (Kreta)', value: 'fruehjahr' },
          { title: 'Sommer (unterwegs)', value: 'sommer' },
          { title: 'Herbst (Kreta)', value: 'herbst' },
        ],
      },
      description: 'Katharinas Jahres-Rhythmus',
      group: 'inhalt',
    }),
    defineField({
      name: 'location',
      title: 'Ort',
      type: 'string',
      options: { placeholder: 'Tempelhof, Hohenlohe …' } as any,
      group: 'inhalt',
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'i18nText',
      group: 'inhalt',
    }),
    defineField({
      name: 'registration',
      title: 'Wie melden sich Leute an?',
      type: 'object',
      fields: [
        defineField({
          name: 'mode',
          title: 'Wie',
          type: 'string',
          options: {
            list: [
              { title: 'E-Mail an Katharina', value: 'mail' },
              { title: 'Externer Link', value: 'link' },
              { title: 'Formular auf der Site', value: 'formular' },
            ],
          },
          initialValue: 'mail',
        }),
        defineField({
          name: 'target',
          title: 'Ziel (Mail-Adresse oder URL)',
          type: 'string',
        }),
      ],
      group: 'anmeldung',
    }),
    defineField({
      name: 'fees',
      title: 'Honorar / Kosten',
      type: 'i18nText',
      description: 'Default: „individuell besprechen"',
      group: 'anmeldung',
    }),
    defineField({
      name: 'dogFriendly',
      title: 'Hundefreundlich? (Carla kann mitkommen)',
      type: 'boolean',
      initialValue: true,
      description: 'Wichtig für eigene Termine — Carla muss dabei sein können',
      group: 'anmeldung',
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      group: 'medien',
    }),
    defineField({
      name: 'programPdf',
      title: 'Programm-Dokument',
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
    defineField({
      name: 'locationCoords',
      title: 'Koordinaten (für Karten-Verschneidung)',
      type: 'geopoint',
      group: 'mehr',
    }),
    accentColorField,
  ],
  orderings: [
    {
      title: 'Nächste zuerst',
      name: 'startAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.de',
      startDate: 'startDate',
      location: 'location',
      ownership: 'ownership',
      media: 'photo',
    },
    prepare({ title, startDate, location, ownership, media }) {
      const date = startDate ? new Date(startDate).toLocaleDateString('de-DE') : '';
      return {
        title: title || '(ohne Titel)',
        subtitle: [date, location, ownership === 'fremder' ? '· fremd' : ''].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
