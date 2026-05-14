import { useCallback, useState } from 'react';
import {
  type DocumentActionComponent,
  type DocumentActionProps,
  useDocumentOperation,
  useClient,
} from 'sanity';
import { slugify } from '../lib/slugify';
import { geocode } from '../lib/geocode';

/**
 * Ersetzt Sanitys Standard-Publish-Action für alle Doc-Types mit
 * einem slug-Feld. Bevor das Dokument veröffentlicht wird, läuft die
 * Action durch ein paar Auto-Enrichment-Schritte:
 *
 *  1. Slug — wenn slug.current leer ist, generiere aus Titel
 *     (title.de oder name, je nach Schema).
 *  2. Geocoding (nur für Stationen) — wenn address gefüllt und
 *     coordinates noch leer, hole Karten-Koordinaten via Nominatim
 *     (OpenStreetMap, kostenfrei, kein API-Key).
 *
 * So muss Katharina weder „Generate" am Slug klicken noch sich mit
 * Longitude/Latitude beschäftigen — sie tippt nur den Ortsnamen
 * bzw. eine Adresse ein, der Rest passiert automatisch.
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
      // ---- Step 1: Slug ----
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

      // ---- Step 2: Geocoding (nur Stationen) ----
      // Wenn Adresse gefüllt aber coordinates noch nicht gesetzt:
      // Adresse via Nominatim auflösen und coordinates schreiben.
      // Schlägt die Geocoding fehl, geht trotzdem publish durch —
      // Katharina kann dann den Pin manuell auf der Karte setzen.
      if (
        type === 'station' &&
        doc?.address &&
        (!doc?.coordinates?.lat || !doc?.coordinates?.lng)
      ) {
        const coords = await geocode(doc.address);
        if (coords) {
          await client
            .patch(id)
            .set({
              coordinates: {
                _type: 'geopoint',
                lat: coords.lat,
                lng: coords.lng,
              },
            })
            .commit();
          console.log(
            `[AutoSlugPublishAction] Geocoded "${doc.address}" → ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
          );
        } else {
          console.warn(
            `[AutoSlugPublishAction] No coordinates found for "${doc.address}". ` +
              `Set the pin manually under "Mehr → Karten-Koordinaten".`,
          );
        }
      }

      publish.execute();
    } finally {
      setProcessing(false);
      onComplete();
    }
  }, [client, doc, id, publish, onComplete, type]);

  return {
    label: processing ? 'Wird veröffentlicht …' : 'Publish',
    disabled: publish.disabled,
    onHandle: handle,
  };
};
