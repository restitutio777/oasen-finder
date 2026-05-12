import { defineField, defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';

/**
 * Mensch / Projekt / Initiative — die in Beiträgen erwähnt werden.
 *
 * Katharina legt einmal eine Person an (Name + Foto + Link), und
 * kann sie dann in jedem Text-Feld inline erwähnen — der Frontend
 * rendert die Erwähnung als Link zur primaryUrl. URL-Änderungen
 * geschehen an einer Stelle, ohne dass alle alten Beiträge angepasst
 * werden müssen.
 */
export const person = defineType({
  name: 'person',
  title: 'Mensch — wen Katharina erwähnt',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Adresse (falls eine eigene Mensch-Seite entsteht)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'role',
      title: 'Kurz-Beschreibung',
      description: 'z.B. „von Tempelhof", „Pikler-Pädagogin", „Schreibt auch auf Substack"',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Foto (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'primaryUrl',
      title: 'Haupt-Link',
      description: 'Wichtigste Webseite oder Profil. Wird beim Klick auf den Namen geöffnet.',
      type: 'url',
    }),
    defineField({
      name: 'additionalLinks',
      title: 'Weitere Links',
      description: 'Substack, Instagram, andere Seiten — optional',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'link',
          fields: [
            defineField({
              name: 'label',
              title: 'Bezeichnung',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Notiz',
      description: 'Wer ist diese Person, was verbindet euch? (optional)',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'name', role: 'role', media: 'photo' },
    prepare({ title, role, media }) {
      return { title, subtitle: role || '', media };
    },
  },
});
