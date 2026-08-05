import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isUsableSlug, toSlug, safeSlug } from './slug.js';

test('normaler Slug ist verwendbar', () => {
  assert.equal(isUsableSlug('gibt-es-schoeneres'), true);
});

test('eingefügter Link ist kein verwendbarer Slug', () => {
  // Der Fall vom 05.08.2026 — hat den kompletten Vercel-Build gekillt.
  assert.equal(isUsableSlug('https://photos.app.goo.gl/zD4bWRxXEEuMzvvu5'), false);
});

test('Schrägstrich, Leerzeichen und Leerstring sind unbrauchbar', () => {
  assert.equal(isUsableSlug('a/b'), false);
  assert.equal(isUsableSlug('zwei woerter'), false);
  assert.equal(isUsableSlug(''), false);
  assert.equal(isUsableSlug(undefined), false);
});

test('Titel wird zu deutschem Slug', () => {
  assert.equal(toSlug('Vom Lebensfluss getragen'), 'vom-lebensfluss-getragen');
  assert.equal(toSlug('Gibt es Schöneres...'), 'gibt-es-schoeneres');
  assert.equal(toSlug('Über das Werkstatt-Treffen 8./9. Juli'), 'ueber-das-werkstatt-treffen-8-9-juli');
});

test('kaputter Slug wird aus dem Titel repariert', () => {
  assert.equal(
    safeSlug('https://photos.app.goo.gl/zD4bWRxXEEuMzvvu5', 'Vom Lebensfluss getragen'),
    'vom-lebensfluss-getragen'
  );
});

test('brauchbarer Slug bleibt unangetastet', () => {
  assert.equal(safeSlug('filzen-im-tempelhof', 'Filzen in Kreta'), 'filzen-im-tempelhof');
});

test('ohne brauchbaren Slug und ohne Titel: null', () => {
  assert.equal(safeSlug(undefined, undefined), null);
  assert.equal(safeSlug('http://x.de/y', '...'), null);
});
