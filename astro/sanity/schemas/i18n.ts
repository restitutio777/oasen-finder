import { defineType, defineField } from 'sanity';

/**
 * Lokalisierter Kurztext (Titel, Eyebrows, Labels).
 *
 * Deutsch ist Pflichtfeld, Französisch und Englisch optional. Die
 * Übersetzungen sitzen in einem zugeklappten Fieldset darunter —
 * Katharina sieht beim Tippen nur das DE-Feld, kann bei Bedarf
 * "Übersetzungen" aufklappen.
 */
export const i18nString = defineType({
  name: 'i18nString',
  title: 'Mehrsprachiger Text (kurz)',
  type: 'object',
  fieldsets: [
    {
      name: 'translations',
      title: 'Übersetzungen (optional)',
      description:
        'Französisch und Englisch sind optional. Leer lassen ist okay — die Seite zeigt dann automatisch den deutschen Text.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'de',
      title: 'Deutsch',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'string',
      fieldset: 'translations',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      fieldset: 'translations',
    }),
  ],
});

/**
 * Lokalisierter Fließtext (mit Block-Editor für Formatierungen).
 * Gleiche Logik wie i18nString — Deutsch im Vordergrund, andere
 * Sprachen zugeklappt darunter.
 */
export const i18nText = defineType({
  name: 'i18nText',
  title: 'Mehrsprachiger Fließtext',
  type: 'object',
  fieldsets: [
    {
      name: 'translations',
      title: 'Übersetzungen (optional)',
      description:
        'Französisch und Englisch sind optional. Leer lassen ist okay — die Seite zeigt dann automatisch den deutschen Text.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'de',
      title: 'Deutsch',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: [{ type: 'block' }],
      fieldset: 'translations',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
      fieldset: 'translations',
    }),
  ],
});
