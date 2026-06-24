import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

/**
 * erkennBAR — Über Katharina. Singleton (nur ein Dokument).
 * Bio, Anliegen, Prägungen, Don't-Liste.
 */
export const about = defineType({
  name: 'about',
  title: 'erkennBAR — Über Katharina',
  type: 'document',
  icon: UserIcon,
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
      description: 'Aus Antwort 3.1d — jeweils ein Wort über den „Hinzufügen"-Button. z.B. Coach, Referent, Experte',
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
    defineField({
      name: 'roomInvitations',
      title: 'Einladungen in die Räume',
      description:
        'Erscheint auf der erkennBAR-Seite als „Schau mal weiter"-Bereich. Pro Eintrag: einen Raum auswählen + ein-zwei Sätze, was Besucher dort finden. Reihenfolge im Array = Reihenfolge auf der Seite. Wenn ganz leer: zeige Default-Vorstellungen aller Räume.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'roomInvitation',
          fields: [
            defineField({
              name: 'room',
              title: 'Raum',
              type: 'string',
              options: {
                list: [
                  { title: 'schreibBAR — Notizen, Gedichte, Ideen', value: 'schreibbar' },
                  { title: 'bewegBAR — Stationen', value: 'bewegbar' },
                  { title: 'machBAR — Werkstatt-Termine', value: 'machbar' },
                  { title: 'lesBAR — Quellen & Werkzeuge', value: 'lesbar' },
                  { title: 'hörBAR — Episoden', value: 'hoerbar' },
                  { title: 'wunderBAR — Kreatives & Off-Topic', value: 'wunderbar' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Einladungs-Text',
              type: 'i18nText',
              description: 'Ein-zwei Sätze in deiner Stimme. Wenn leer, wird der Default-Text gezeigt.',
            }),
            defineField({
              name: 'ctaLabel',
              title: 'Button-Text (optional)',
              type: 'i18nString',
              description: 'Default: „Zum Raum →". Hier kannst du etwas Eigenes setzen, z.B. „Lies meine Notizen →".',
            }),
          ],
          preview: {
            select: { room: 'room', desc: 'description.de' },
            prepare({ room, desc }) {
              const roomLabels: Record<string, string> = {
                schreibbar: 'schreibBAR',
                bewegbar: 'bewegBAR',
                machbar: 'machBAR',
                lesbar: 'lesBAR',
                hoerbar: 'hörBAR',
                wunderbar: 'wunderBAR',
              };
              return {
                title: room ? roomLabels[room] : '(noch kein Raum)',
                subtitle: desc && Array.isArray(desc) && desc.length > 0 ? '✓ eigene Beschreibung' : 'Default-Text',
              };
            },
          },
        },
      ],
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
