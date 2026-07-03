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
