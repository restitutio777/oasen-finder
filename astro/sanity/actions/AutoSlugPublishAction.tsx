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
  // ungespeicherten Änderungen existieren). Beim Re-Publish nach
  // einer Adress-Änderung brauchen wir den Vergleich draft vs.
  // published, um zu erkennen ob die Adresse sich verändert hat.
  const doc: any = draft || published;
  const publishedAddress: string | undefined = (published as any)?.address;
  const draftAddress: string | undefined = doc?.address;
  const addressChanged =
    !!draftAddress &&
    typeof publishedAddress === 'string' &&
    publishedAddress.trim() !== draftAddress.trim();

  // Wenn das Dokument noch nie publiziert wurde, existiert nur der
  // Draft (drafts.{id}). client.patch(id) schlägt dann mit
  // „document not found" fehl — wir müssen die Draft-ID patchen.
  // Wenn schon Published vorhanden ist und ein Draft existiert,
  // arbeiten wir trotzdem am Draft (das ist der Stand, der gleich
  // publiziert wird). Nur wenn kein Draft existiert (Re-Publish ohne
  // Änderungen), patchen wir das Published-Dokument direkt.
  const patchTargetId = draft ? `drafts.${id}` : id;

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
            .patch(patchTargetId)
            .set({ slug: { _type: 'slug', current: generated } })
            .commit();
        }
      }

      // ---- Step 2: Geocoding (nur Stationen) ----
      // Wenn die Adresse gefüllt ist und entweder noch keine
      // Coordinates existieren ODER die Adresse sich gegenüber dem
      // bereits publizierten Stand geändert hat, neu geocoden.
      //
      // So funktioniert sowohl:
      //   (a) erstes Anlegen — Adresse rein, Pin folgt
      //   (b) nachträgliches Umziehen — Adresse ändern, alte
      //       Coordinates werden überschrieben
      //
      // Manuelle Pin-Korrekturen bleiben intakt, solange die
      // Adresse nicht angetastet wird.
      const needsGeocode =
        type === 'station' &&
        !!draftAddress &&
        (!doc?.coordinates?.lat || !doc?.coordinates?.lng || addressChanged);

      if (needsGeocode) {
        const coords = await geocode(draftAddress!);
        if (coords) {
          await client
            .patch(patchTargetId)
            .set({
              coordinates: {
                _type: 'geopoint',
                lat: coords.lat,
                lng: coords.lng,
              },
            })
            .commit();
          console.log(
            `[AutoSlugPublishAction] Geocoded "${draftAddress}" → ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` +
              (addressChanged ? ' (address changed, overwriting old pin)' : ''),
          );
        } else {
          console.warn(
            `[AutoSlugPublishAction] No coordinates found for "${draftAddress}". ` +
              `Set the pin manually under "Mehr → Karten-Koordinaten".`,
          );
        }
      }

      publish.execute();
    } finally {
      setProcessing(false);
      onComplete();
    }
  }, [client, doc, id, patchTargetId, publish, onComplete, type, draftAddress, addressChanged]);

  return {
    label: processing ? 'Wird veröffentlicht …' : 'Publish',
    disabled: publish.disabled,
    onHandle: handle,
  };
};
