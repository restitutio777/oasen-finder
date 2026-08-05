import { useCallback, useState } from 'react';
import {
  type DocumentActionComponent,
  type DocumentActionProps,
  useDocumentOperation,
  useClient,
} from 'sanity';
import { useToast } from '@sanity/ui';
import { slugify, isUsableSlug } from '../lib/slugify';
import { geocode } from '../lib/geocode';

/**
 * Ersetzt Sanitys Standard-Publish-Action für alle Doc-Types mit
 * einem slug-Feld. Bevor das Dokument veröffentlicht wird, läuft die
 * Action durch ein paar Auto-Enrichment-Schritte:
 *
 *  1. Slug — wenn slug.current leer ODER unbrauchbar ist, generiere aus
 *     Titel (title.de oder name, je nach Schema).
 *  2. Geocoding (nur für Stationen) — wenn address gefüllt und
 *     coordinates noch leer, hole Karten-Koordinaten via Nominatim
 *     (OpenStreetMap, kostenfrei, kein API-Key).
 *
 * So muss Katharina weder „Generate" am Slug klicken noch sich mit
 * Longitude/Latitude beschäftigen — sie tippt nur den Ortsnamen
 * bzw. eine Adresse ein, der Rest passiert automatisch.
 *
 * Robustheit (wichtig fürs Handy / wackliges Netz): Die Auto-
 * Enrichment-Schritte dürfen das Veröffentlichen NIE blockieren.
 * Schlägt Slug-Patch oder Geocoding fehl, wird der Eintrag trotzdem
 * publiziert und Katharina bekommt einen sichtbaren Hinweis (Toast)
 * statt eines stummen Abbruchs, der wie ein „Backend-Fehler" wirkt.
 */
export const AutoSlugPublishAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const { id, type, draft, published, onComplete } = props;
  const { publish } = useDocumentOperation(id, type);
  const client = useClient({ apiVersion: '2024-03-01' });
  const toast = useToast();
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

      /* Nicht nur „leer", sondern „unbrauchbar" ist der Auslöser (05.08.):
         In einer Notiz stand ein Google-Photos-Link im Adress-Feld. Astro
         baut aus dem Slug den Dateipfad der Detailseite — mit Schrägstrichen
         darin scheiterte der komplette Vercel-Build, und die Live-Site blieb
         tagelang stehen, obwohl im Studio alles veröffentlicht aussah.
         Deshalb wird eine kaputte Adresse hier beim Veröffentlichen still
         durch eine saubere aus dem Titel ersetzt — mit sichtbarem Hinweis,
         damit Katharina merkt, dass ihr Link woanders hingehört. */
      const existingSlug: string | undefined = doc?.slug?.current;
      const slugNeedsFix = !isUsableSlug(existingSlug);

      if (titleSource && slugNeedsFix) {
        const generated = slugify(titleSource);
        if (generated) {
          // Eigener try/catch: ein fehlgeschlagener Slug-Patch darf
          // das Veröffentlichen nicht verhindern.
          try {
            await client
              .patch(patchTargetId)
              .set({ slug: { _type: 'slug', current: generated } })
              .commit();
            if (existingSlug) {
              toast.push({
                status: 'warning',
                title: 'Adresse der Seite wurde korrigiert',
                description:
                  `Im Feld „Adresse dieser Seite" stand „${existingSlug}" — daraus lässt sich keine Web-Adresse bauen. ` +
                  `Der Eintrag ist jetzt unter „${generated}" veröffentlicht. ` +
                  'Falls du einen Link zeigen wolltest: Der gehört in „Externer Link" bzw. „Medien-Link".',
                duration: 15000,
              });
            }
          } catch (err) {
            console.error('[AutoSlugPublishAction] Slug-Patch fehlgeschlagen:', err);
            toast.push({
              status: 'warning',
              title: 'Adresse konnte nicht automatisch gesetzt werden',
              description:
                'Der Eintrag wird trotzdem veröffentlicht. Du kannst „Adresse dieser Seite" bei Bedarf unter „Mehr" von Hand eintragen.',
            });
          }
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
        // Eigener try/catch: Karten-Suche (Nominatim) ist „best effort".
        // Netzfehler/Timeout dürfen das Veröffentlichen nie aufhalten.
        try {
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
            toast.push({
              status: 'warning',
              title: 'Kein Karten-Punkt gefunden',
              description:
                `Für „${draftAddress}" wurde kein Ort gefunden. Der Eintrag wird trotzdem veröffentlicht — ` +
                'den Pin kannst du unter „Mehr → Karten-Koordinaten" von Hand auf der Karte setzen.',
            });
          }
        } catch (err) {
          console.error('[AutoSlugPublishAction] Geocoding fehlgeschlagen:', err);
          toast.push({
            status: 'warning',
            title: 'Karten-Suche gerade nicht erreichbar',
            description:
              'Der Eintrag wird trotzdem veröffentlicht. Den Karten-Pin kannst du später unter „Mehr → Karten-Koordinaten" setzen.',
          });
        }
      }

      // ---- Veröffentlichen ----
      // Läuft IMMER, auch wenn die Schritte oben fehlgeschlagen sind.
      publish.execute();
    } catch (err) {
      // Letztes Sicherheitsnetz: Selbst bei einem unerwarteten Fehler
      // soll Katharina nicht mit einem stummen, „toten" Button
      // dastehen. Wir zeigen den Fehler und versuchen trotzdem zu
      // veröffentlichen.
      console.error('[AutoSlugPublishAction] Unerwarteter Fehler:', err);
      toast.push({
        status: 'error',
        title: 'Da ist etwas schiefgelaufen',
        description:
          'Bitte tippe noch einmal auf „Publish". Falls es weiter klemmt, sag Reto Bescheid.',
      });
      try {
        publish.execute();
      } catch {
        /* publish nicht möglich — Fehler wurde bereits gemeldet */
      }
    } finally {
      setProcessing(false);
      onComplete();
    }
  }, [client, doc, patchTargetId, publish, onComplete, type, draftAddress, addressChanged, toast]);

  return {
    label: processing ? 'Wird veröffentlicht …' : 'Publish',
    disabled: publish.disabled,
    onHandle: handle,
  };
};
