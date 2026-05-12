import { defineField, defineType } from 'sanity';

/**
 * BewegBAR-Station — ein besuchter Gemeinschaftsort.
 * Mit geopoint für die Karten-Komponente.
 */
export const station = defineType({
  name: 'station',
  title: 'BewegBAR — Station',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name des Ortes',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      description: 'z.B. Hohenlohe, Kreta, Provence',
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      options: {
        list: [
          { title: 'Deutschland', value: 'de' },
          { title: 'Österreich', value: 'at' },
          { title: 'Schweiz', value: 'ch' },
          { title: 'Frankreich', value: 'fr' },
          { title: 'Griechenland', value: 'gr' },
          { title: 'USA', value: 'us' },
          { title: 'Andere', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'visitedAt',
      title: 'Besucht am',
      type: 'date',
    }),
    defineField({
      name: 'visitedRange',
      title: 'Besuchszeitraum (alternativ)',
      type: 'object',
      fields: [
        defineField({ name: 'from', title: 'Von', type: 'date' }),
        defineField({ name: 'to', title: 'Bis', type: 'date' }),
      ],
      description: 'Falls mehrtägig — sonst leer lassen',
    }),
    defineField({
      name: 'coordinates',
      title: 'Koordinaten (für Karte)',
      type: 'geopoint',
    }),
    defineField({
      name: 'images',
      title: 'Bilder',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'caption', title: 'Bildunterschrift', type: 'i18nString' }),
            defineField({ name: 'alt', title: 'Alt-Text', type: 'i18nString' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'reflection',
      title: 'Reflexion / Beschreibung',
      type: 'i18nText',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'z.B. Ökodorf, Cohousing, Spirituell, Pikler, Steiner',
    }),
    defineField({
      name: 'communityLink',
      title: 'Link zur Gemeinschaft',
      type: 'url',
    }),
    defineField({
      name: 'conceptPdf',
      title: 'Konzept-PDF des Ortes',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      region: 'region',
      country: 'country',
      media: 'images.0',
    },
    prepare({ title, region, country, media }) {
      return {
        title,
        subtitle: [region, country?.toUpperCase()].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
