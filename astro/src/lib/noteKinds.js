/**
 * Arten eines schreibBAR-Eintrags — Sanity-Feld `kind` am Doc-Type `note`.
 *
 * Eine Stelle für Reihenfolge und Beschriftung. Vorher standen die Labels
 * dreimal im Code (Liste, Detailseite, Filter) und liefen auseinander.
 *
 * WICHTIG — der gespeicherte Wert `notiz` heißt im Backend und auf der Seite
 * „Gedanke" (19.09.26, Katharina: „Notiz ist zu gewöhnlich"). Nur das Label
 * wurde getauscht, nicht der Wert: jeder bestehende Eintrag im Dataset trägt
 * `notiz`, und ein Umschreiben wäre eine Migration über alle Dokumente. Wer
 * hier `notiz` liest, meint also „Gedanke" — nicht zurückbenennen.
 *
 * Zwillingsliste im Studio: `astro/sanity/schemas/note.ts`. Das Studio ist ein
 * eigenes npm-Projekt und kann diese Datei nicht importieren — wer hier etwas
 * ändert, ändert es dort mit, sonst kann Katharina eine Art wählen, die die
 * Seite nicht beschriften kann.
 */

/** Arten, die NICHT in der schreibBAR leben, sondern in /denkbar/. */
export const DENKBAR_KINDS = ['idee', 'vision', 'umfrage'];

/** schreibBAR-Arten in Anzeige- und Auswahlreihenfolge. */
export const SCHREIBBAR_KINDS = [
  { value: 'notiz', label: 'Gedanke' },
  { value: 'tagebuch', label: 'Tagebucheintrag' },
  { value: 'reisebericht', label: 'Reisebericht' },
  { value: 'begegnung', label: 'Begegnung' },
  { value: 'brief', label: 'Brief' },
  { value: 'poesie', label: 'Poesie' },
];

/** Beschriftung einer Art — auch für die denkBAR-Arten, die in der
 *  Startseiten-Vorschau und in alten Einträgen auftauchen können. */
const LABELS = {
  ...Object.fromEntries(SCHREIBBAR_KINDS.map((k) => [k.value, k.label])),
  idee: 'Idee',
  vision: 'Vision',
  umfrage: 'Umfrage',
};

/**
 * Beschriftung für ein `kind`. Unbekannte Werte (alter Eintrag, neue Art im
 * Studio, hier noch nicht nachgetragen) fallen auf „Gedanke" zurück statt auf
 * einen rohen Feldwert in Versalien.
 */
export function noteKindLabel(kind) {
  return LABELS[kind] || 'Gedanke';
}

/**
 * GROQ-Teilbedingung für „gehört in die schreibBAR".
 *
 * Bewusst über den Ausschluss der denkBAR-Arten formuliert, nicht über eine
 * Aufzählung der schreibBAR-Arten: Eine neue Art im Studio erscheint damit
 * automatisch, statt lautlos aus Liste UND Route zu fallen — ein Eintrag,
 * den Katharina veröffentlicht hat und der nirgends auftaucht, ist der
 * teuerste Fehler dieses Projekts.
 */
export const SCHREIBBAR_KIND_FILTER = `!(kind in ${JSON.stringify(DENKBAR_KINDS)})`;
