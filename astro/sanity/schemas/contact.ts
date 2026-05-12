import { defineField, defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

/**
 * Mitkommen-Konfiguration. Singleton.
 * Definiert die Einladungs-Kategorien, Empfänger-Mail, Intro-Text.
 */
export const contact = defineType({
  name: 'contact',
  title: 'Mitkommen — Formular-Konfiguration',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'intro',
      title: 'Einleitungstext',
      type: 'i18nText',
      description: '„Drei Wege, von hier aus weiter — wähl, was zu dir passt." oder eigene Formulierung',
    }),
    defineField({
      name: 'emailRecipient',
      title: 'Empfänger-Mail-Adresse',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
      description: 'Wohin gehen die Anfragen aus dem Formular',
    }),
    defineField({
      name: 'inviteCategories',
      title: 'Einladungs-Kategorien',
      type: 'array',
      of: [
        defineField({
          name: 'category',
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
                  { title: 'Beratung beim Aufbau', value: 'beratung' },
                  { title: 'Interview', value: 'interview' },
                  { title: 'Persönliches Gespräch', value: 'gespraech' },
                  { title: 'Bei Vernetzung helfen', value: 'vernetzung' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label im Formular',
              type: 'i18nString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Kurz-Beschreibung',
              type: 'i18nString',
            }),
            defineField({
              name: 'active',
              title: 'Aktiv anzeigen?',
              type: 'boolean',
              initialValue: true,
              description: 'z.B. „Interview" erst später aktivieren',
            }),
          ],
          preview: {
            select: { title: 'label.de', kind: 'kind', active: 'active' },
            prepare: ({ title, kind, active }) => ({
              title: title || kind,
              subtitle: active ? kind : `${kind} (inaktiv)`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'feesNote',
      title: 'Hinweis zu Rahmenbedingungen',
      type: 'i18nString',
      description: 'Aus Antwort 3.5c — z.B. „individuell besprechen"',
      initialValue: {
        de: 'Rahmenbedingungen besprechen wir individuell.',
      },
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter-Block („Brief von unterwegs")',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'i18nString' }),
        defineField({ name: 'text', title: 'Beschreibung', type: 'i18nString' }),
        defineField({
          name: 'mode',
          title: 'Modus',
          type: 'string',
          options: {
            list: [
              { title: 'Mail-Link (vorläufig)', value: 'mail' },
              { title: 'Buttondown', value: 'buttondown' },
              { title: 'MailerLite', value: 'mailerlite' },
              { title: 'Substack-Embed', value: 'substack' },
            ],
          },
          initialValue: 'mail',
        }),
        defineField({
          name: 'target',
          title: 'Target (Mail-Adresse oder Embed-URL)',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: { recipient: 'emailRecipient' },
    prepare({ recipient }) {
      return {
        title: 'Mitkommen — Konfiguration',
        subtitle: recipient || '(noch keine Mail-Adresse gesetzt)',
      };
    },
  },
});
