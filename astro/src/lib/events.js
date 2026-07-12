/**
 * Ein Termin gilt erst als vorbei, wenn sein Enddatum (falls gesetzt)
 * verstrichen ist — nicht schon nach dem Startdatum. Mehrtägige Termine
 * (z.B. Werkstatt-Wochen, Online-Kurse über mehrere Wochen) liefen sonst
 * fälschlich schon "vergangen", sobald sie begonnen hatten (Bug 03.07.,
 * "Nebenübungen zu dritt" 29.6.–7.8. verschwand am 3.7. unter "Vergangene
 * Termine").
 *
 * Einzige Stelle, die diese Regel kennt — jede Terminliste (Startseite,
 * machBAR-Übersicht) importiert von hier statt sie neu zu implementieren.
 * Siehe events.test.js für die Regressionstests.
 *
 * @param {{ startDate: string, endDate?: string | null }} event
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isEventPast(event, now = new Date()) {
  return new Date(event.endDate || event.startDate) < now;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** So lange bleibt ein beendeter Termin noch sichtbar im „Rückblick". */
export const LOOKBACK_AFTER_END_DAYS = 7;
/** So lange hält eine (Neu-)Veröffentlichung einen Termin im „Rückblick". */
export const LOOKBACK_AFTER_PUBLISH_DAYS = 14;

/**
 * Wandert ein vergangener Termin schon ins eingeklappte Archiv
 * („Vergangene Termine") — oder bleibt er sichtbar im „Rückblick"?
 *
 * Hintergrund (12.07.): Katharina veröffentlichte den Bericht zur
 * Sommer-Werkstatt (8.–9.7.) erst NACH dem Termin — und der frische
 * Beitrag verschwand sofort unsichtbar hinter dem zugeklappten
 * „Vergangene Termine". Ein Artikel muss erst eine Weile sichtbar
 * gewesen sein, bevor er ins Archiv rutscht.
 *
 * Archiviert wird deshalb erst, wenn BEIDES gilt:
 *   1. das Termin-Ende liegt > LOOKBACK_AFTER_END_DAYS zurück
 *      (gerade zu Ende gegangene Termine verschwinden nicht abrupt), und
 *   2. die letzte Veröffentlichung (_updatedAt, Sanitys Publish-Zeitpunkt)
 *      liegt > LOOKBACK_AFTER_PUBLISH_DAYS zurück (ein frisch
 *      veröffentlichter oder überarbeiteter Bericht bleibt sichtbar).
 *
 * Bewusst _updatedAt statt _createdAt: Der Sommer-Werkstatt-Eintrag
 * wurde im Mai angelegt, der Bericht aber erst im Juli eingepflegt —
 * _createdAt hätte ihn trotzdem sofort archiviert. Die Startseite
 * („Zuletzt veröffentlicht") nutzt _updatedAt genauso.
 *
 * @param {{ startDate: string, endDate?: string | null, _updatedAt?: string | null }} event
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isEventArchived(event, now = new Date()) {
  if (!isEventPast(event, now)) return false;
  const end = new Date(event.endDate || event.startDate);
  if (now - end < LOOKBACK_AFTER_END_DAYS * DAY_MS) return false;
  // Ohne _updatedAt (sollte aus Sanity immer kommen) zählt nur das Termin-Ende.
  if (event._updatedAt && now - new Date(event._updatedAt) < LOOKBACK_AFTER_PUBLISH_DAYS * DAY_MS) {
    return false;
  }
  return true;
}
