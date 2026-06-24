import { defineField, defineType } from 'sanity';
import { PinIcon } from '@sanity/icons';
import { docGroups, accentColorField } from './_shared';

/**
 * BewegBAR-Station — ein besuchter Gemeinschaftsort.
 * Mit geopoint für die Karten-Komponente.
 */
export const station = defineType({
  name: 'station',
  title: 'BewegBAR — Station',
  type: 'document',
  icon: PinIcon,
  groups: [...docGroups],
  fields: [
    defineField({
      name: 'name',
      title: 'Name des Ortes',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'inhalt',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: { placeholder: 'Hohenlohe, Kreta, Provence …' } as any,
      group: 'inhalt',
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
      group: 'inhalt',
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'string',
      description:
        'Ort oder Adresse — z.B. „Schloss Tempelhof, Kreßberg" oder „Auroville, Indien". Beim Veröffentlichen werden die Karten-Koordinaten automatisch aus dieser Angabe ermittelt — du brauchst Longitude/Latitude nicht selbst zu setzen.',
      group: 'inhalt',
    }),
    defineField({
      name: 'visitedAt',
      title: 'Besucht am',
      type: 'date',
      group: 'inhalt',
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
      group: 'inhalt',
    }),
    defineField({
      name: 'reflection',
      title: 'Reflexion / Beschreibung',
      type: 'i18nText',
      group: 'inhalt',
    }),
    defineField({
      name: 'tags',
      title: 'Schlagworte',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional. Jeweils ein Wort über den „Hinzufügen"-Button (funktioniert auch am Handy). Beispiele: Ökodorf, Cohousing, Spirituell, Steiner.',
      group: 'inhalt',
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
      group: 'medien',
    }),
    defineField({
      name: 'conceptPdf',
      title: 'Konzept-Dokument des Ortes',
      description: 'PDF, Word (.doc/.docx), OpenDocument (.odt) oder reiner Text (.txt)',
      type: 'file',
      options: { accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,text/plain' },
      group: 'medien',
    }),
    defineField({
      name: 'slug',
      title: 'URL-Adresse',
      description: 'Wird beim Veröffentlichen automatisch aus dem Namen generiert — du kannst sie hier auch eigenständig setzen, wenn du möchtest.',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      group: 'mehr',
    }),
    defineField({
      name: 'coordinates',
      title: 'Karten-Koordinaten (automatisch)',
      type: 'geopoint',
      description:
        'Werden beim Veröffentlichen automatisch aus dem Adress-Feld ermittelt. Falls der Punkt auf der Karte daneben liegt, kannst du ihn hier manuell anpassen — klick einfach auf der Karte.',
      group: 'mehr',
    }),
    defineField({
      name: 'communityLink',
      title: 'Link zur Gemeinschaft',
      type: 'url',
      group: 'mehr',
    }),
    accentColorField,
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
