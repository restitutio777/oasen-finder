import { useCallback, useState } from 'react';
import {
  type DocumentActionComponent,
  type DocumentActionProps,
  useDocumentOperation,
  useClient,
} from 'sanity';
import { slugify } from '../lib/slugify';

/**
 * Ersetzt Sanitys Standard-Publish-Action für alle Doc-Types mit
 * einem slug-Feld. Bevor das Dokument veröffentlicht wird, prüft die
 * Action, ob slug.current leer ist und generiert ihn dann aus dem
 * Titel (title.de oder name, je nach Schema).
 *
 * So muss Katharina nicht zwingend den "Generate"-Knopf am Slug-Feld
 * klicken — sie kann es, falls sie eine eigene URL möchte, muss es
 * aber nicht. Friktion entfernt.
 */
export const AutoSlugPublishAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const { id, type, draft, published, onComplete } = props;
  const { publish } = useDocumentOperation(id, type);
  const client = useClient({ apiVersion: '2024-03-01' });
  const [processing, setProcessing] = useState(false);

  // Es wird mit dem Draft gearbeitet (oder Published, falls keine
  // ungespeicherten Änderungen existieren)
  const doc: any = draft || published;

  const handle = useCallback(async () => {
    setProcessing(true);
    try {
      // Quell-Titel für die Slug-Generierung:
      // - i18n-Titel (note, event, resource, episode, wonder)
      // - oder schlichter name (station)
      const titleSource: string | undefined =
        doc?.title?.de || doc?.name;

      if (titleSource && !doc?.slug?.current) {
        const generated = slugify(titleSource);
        if (generated) {
          await client
            .patch(id)
            .set({ slug: { _type: 'slug', current: generated } })
            .commit();
        }
      }

      publish.execute();
    } finally {
      setProcessing(false);
      onComplete();
    }
  }, [client, doc, id, publish, onComplete]);

  return {
    label: processing ? 'Wird veröffentlicht …' : 'Publish',
    disabled: publish.disabled,
    onHandle: handle,
  };
};
