import { defineType, defineField } from 'sanity';

/**
 * Lokalisierter Kurztext (Titel, Eyebrows, Labels).
 * Deutsch ist Pflichtfeld, Französisch und Englisch optional —
 * Katharina füllt schrittweise.
 */
export const i18nString = defineType({
  name: 'i18nString',
  title: 'Mehrsprachiger Text (kurz)',
  type: 'object',
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
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
    }),
  ],
});

/**
 * Lokalisierter Fließtext (mit Block-Editor für Formatierungen).
 * Gleiche Logik wie i18nString — Deutsch zuerst, Übersetzungen folgen.
 */
export const i18nText = defineType({
  name: 'i18nText',
  title: 'Mehrsprachiger Fließtext',
  type: 'object',
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
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
