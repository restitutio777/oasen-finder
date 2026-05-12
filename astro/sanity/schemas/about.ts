import { defineField, defineType } from 'sanity';

/**
 * erkennBAR — Über Katharina. Singleton (nur ein Dokument).
 * Bio, Anliegen, Prägungen, Don't-Liste.
 */
export const about = defineType({
  name: 'about',
  title: 'erkennBAR — Über Katharina',
  type: 'document',
  // Singleton-Pattern wird über Structure-Config im Studio enforced
  fields: [
    defineField({
      name: 'shortBio',
      title: 'Kurz-Bio (3-4 Sätze)',
      type: 'i18nText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'longBio',
      title: 'Lange Bio (Lebensgeschichte)',
      type: 'i18nText',
    }),
    defineField({
      name: 'portraits',
      title: 'Porträt-Fotos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'kind',
              title: 'Art',
              type: 'string',
              options: {
                list: [
                  { title: 'Porträt', value: 'portrait' },
                  { title: 'Hände bei der Arbeit', value: 'hands' },
                  { title: 'Draußen unterwegs', value: 'outdoors' },
                ],
              },
            }),
            defineField({ name: 'alt', title: 'Alt-Text', type: 'i18nString' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'mantra',
      title: 'Anliegen-Satz',
      type: 'i18nString',
      description: 'z.B. „Ich möchte Menschen in Denk-, Fühl- und Kreativ-Räume einladen…"',
    }),
    defineField({
      name: 'influences',
      title: 'Prägungs-Liste',
      type: 'array',
      of: [{ type: 'i18nString' }],
      description: 'z.B. Waldorfschule, Pikler, Steiner-Dreigliederung, Wien, Bayern, Kreta',
    }),
    defineField({
      name: 'notDescribedAs',
      title: 'Don\'t-Liste — so nicht beschreiben',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Aus Antwort 3.1d — z.B. Coach, Referent, Experte',
    }),
    defineField({
      name: 'invitations',
      title: 'Welche Anfragen Katharina annimmt',
      type: 'array',
      of: [
        defineField({
          name: 'invitation',
          type: 'object',
          fields: [
            defineField({
              name: 'kind',
              title: 'Art',
              type: 'string',
              options: {
                list: [
                  { title: 'Werkstatt-Teilnahme', value: 'werkstatt' },
                  { title: 'Einladung in Gemeinschaft', value: 'einladung' },
                  { title: 'Vortrag / Impuls', value: 'vortrag' },
                  { title: 'Beratung beim Gemeinschafts-Aufbau', value: 'beratung' },
                  { title: 'Interview (später)', value: 'interview' },
                  { title: 'Persönliches Gespräch', value: 'gespraech' },
                  { title: 'Bei Vernetzung helfen', value: 'vernetzung' },
                ],
              },
            }),
            defineField({ name: 'label', title: 'Label', type: 'i18nString' }),
            defineField({ name: 'note', title: 'Hinweis', type: 'i18nString' }),
          ],
          preview: {
            select: { title: 'label.de', kind: 'kind' },
            prepare: ({ title, kind }) => ({ title: title || kind, subtitle: kind }),
          },
        }),
      ],
    }),
    defineField({
      name: 'seasonality',
      title: 'Jahres-Rhythmus (sichtbar machen)',
      type: 'i18nText',
      description: 'Winter Verdauen · F/H Kreta · Sommer reisend',
    }),
  ],
  preview: {
    select: { mantra: 'mantra.de', portrait: 'portraits.0' },
    prepare({ mantra, portrait }) {
      return {
        title: 'erkennBAR — Über Katharina',
        subtitle: mantra || '(noch keine Bio)',
        media: portrait,
      };
    },
  },
});
