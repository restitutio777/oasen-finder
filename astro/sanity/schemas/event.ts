import { defineField, defineType } from 'sanity';

/**
 * MachBAR-Event — Werkstatt-Termin.
 * Mit Saison-Filter (Katharinas Jahres-Rhythmus) und Hundefreundlich-Flag (Carla).
 */
export const event = defineType({
  name: 'event',
  title: 'MachBAR — Werkstatt-Termin',
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
      name: 'startDate',
      title: 'Datum / Beginn',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Ende (falls mehrtägig)',
      type: 'datetime',
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
    }),
    defineField({
      name: 'location',
      title: 'Ort',
      type: 'string',
      description: 'z.B. Tempelhof, Hohenlohe',
    }),
    defineField({
      name: 'locationCoords',
      title: 'Koordinaten (für Karten-Verschneidung)',
      type: 'geopoint',
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'i18nText',
    }),
    defineField({
      name: 'registration',
      title: 'Anmeldung',
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
    }),
    defineField({
      name: 'dogFriendly',
      title: 'Hundefreundlich? (Carla kann mitkommen)',
      type: 'boolean',
      initialValue: true,
      description: 'Katharinas Hund Carla muss bei eigenen Terminen dabei sein können',
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'programPdf',
      title: 'Programm-PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
    defineField({
      name: 'fees',
      title: 'Honorar / Kosten',
      type: 'i18nText',
      description: 'Default: „individuell besprechen" — Katharinas Wahl aus Antwort 3.5c',
    }),
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
