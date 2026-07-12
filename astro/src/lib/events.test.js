import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEventPast, isEventArchived } from './events.js';

test('laufender Mehrtages-Termin gilt nicht als vergangen', () => {
  assert.equal(
    isEventPast({ startDate: '2026-06-29', endDate: '2026-08-07' }, new Date('2026-07-03')),
    false
  );
});

test('abgeschlossener Mehrtages-Termin gilt als vergangen', () => {
  assert.equal(
    isEventPast({ startDate: '2026-06-29', endDate: '2026-08-07' }, new Date('2026-08-08')),
    true
  );
});

test('zukünftiger Eintages-Termin (ohne endDate) gilt nicht als vergangen', () => {
  assert.equal(isEventPast({ startDate: '2026-12-01' }, new Date('2026-07-03')), false);
});

test('vergangener Eintages-Termin ohne endDate gilt als vergangen', () => {
  assert.equal(isEventPast({ startDate: '2026-01-01' }, new Date('2026-07-03')), true);
});

test('Termin gilt erst am Tag nach dem Enddatum als vergangen', () => {
  assert.equal(
    isEventPast({ startDate: '2026-06-01', endDate: '2026-07-01' }, new Date('2026-07-02')),
    true
  );
  assert.equal(
    isEventPast({ startDate: '2026-06-01', endDate: '2026-07-01' }, new Date('2026-06-30')),
    false
  );
});

/* --- isEventArchived: Rückblick vs. eingeklapptes Archiv (Bug 12.07.) --- */

// Das echte Szenario: Sommer-Werkstatt 8.–9.7., Bericht am 12.7. veröffentlicht.
// Der frische Bericht darf NICHT sofort hinter „Vergangene Termine" verschwinden.
const sommerWerkstatt = {
  startDate: '2026-07-08T10:00:00Z',
  endDate: '2026-07-09T13:00:00Z',
  _updatedAt: '2026-07-12T15:18:20Z',
};

test('frisch veröffentlichter Bericht zu vergangenem Termin bleibt im Rückblick', () => {
  assert.equal(isEventArchived(sommerWerkstatt, new Date('2026-07-12T16:00:00Z')), false);
});

test('Bericht bleibt 14 Tage nach Veröffentlichung sichtbar, dann Archiv', () => {
  assert.equal(isEventArchived(sommerWerkstatt, new Date('2026-07-25T12:00:00Z')), false);
  assert.equal(isEventArchived(sommerWerkstatt, new Date('2026-07-27T12:00:00Z')), true);
});

test('gerade beendeter Termin bleibt 7 Tage im Rückblick, auch ohne frische Veröffentlichung', () => {
  const langVeroeffentlicht = {
    startDate: '2026-07-08',
    endDate: '2026-07-10',
    _updatedAt: '2026-05-01T00:00:00Z',
  };
  assert.equal(isEventArchived(langVeroeffentlicht, new Date('2026-07-12T12:00:00Z')), false);
  assert.equal(isEventArchived(langVeroeffentlicht, new Date('2026-07-18T12:00:00Z')), true);
});

test('laufender oder zukünftiger Termin ist nie archiviert', () => {
  assert.equal(
    isEventArchived(
      { startDate: '2026-06-29', endDate: '2026-08-07', _updatedAt: '2026-01-01T00:00:00Z' },
      new Date('2026-07-12T12:00:00Z')
    ),
    false
  );
  assert.equal(
    isEventArchived({ startDate: '2026-12-01', _updatedAt: '2026-01-01T00:00:00Z' }, new Date('2026-07-12T12:00:00Z')),
    false
  );
});

test('alter Termin ohne _updatedAt archiviert nach Ende+7 Tagen', () => {
  assert.equal(isEventArchived({ startDate: '2026-01-10' }, new Date('2026-07-12T12:00:00Z')), true);
  assert.equal(isEventArchived({ startDate: '2026-07-10' }, new Date('2026-07-12T12:00:00Z')), false);
});
