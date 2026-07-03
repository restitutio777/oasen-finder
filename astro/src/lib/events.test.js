import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEventPast } from './events.js';

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
