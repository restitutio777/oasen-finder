import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  SCHREIBBAR_KINDS,
  DENKBAR_KINDS,
  SCHREIBBAR_KIND_FILTER,
  noteKindLabel,
} from './noteKinds.js';

test('jede schreibBAR-Art hat Wert und Beschriftung', () => {
  for (const k of SCHREIBBAR_KINDS) {
    assert.ok(k.value, 'Art ohne Wert');
    assert.equal(noteKindLabel(k.value), k.label);
  }
});

test('Werte sind eindeutig und kollidieren nicht mit denkBAR', () => {
  const values = SCHREIBBAR_KINDS.map((k) => k.value);
  assert.equal(new Set(values).size, values.length);
  for (const d of DENKBAR_KINDS) assert.ok(!values.includes(d));
});

test('unbekannte Art faellt auf Gedanke zurueck, nicht auf den Rohwert', () => {
  assert.equal(noteKindLabel('gibtsnicht'), 'Gedanke');
  assert.equal(noteKindLabel(undefined), 'Gedanke');
});

test('GROQ-Filter schliesst genau die denkBAR-Arten aus', () => {
  assert.equal(SCHREIBBAR_KIND_FILTER, '!(kind in ["idee","vision","umfrage"])');
});

/*
 * Der eigentliche Grund fuer diese Datei: die Arten stehen doppelt im Repo —
 * hier fuers Frontend, im Studio-Schema fuer Katharinas Auswahl. Laufen sie
 * auseinander, kann sie eine Art waehlen, die die Seite nicht beschriften
 * kann (oder umgekehrt). Der Test liest das Schema als Text, weil es in einem
 * eigenen npm-Projekt liegt und nicht importierbar ist.
 */
test('Studio-Schema und Frontend kennen dieselben Arten', () => {
  const schemaPath = fileURLToPath(
    new URL('../../sanity/schemas/note.ts', import.meta.url),
  );
  const src = readFileSync(schemaPath, 'utf8');
  const block = src.slice(src.indexOf("name: 'kind'"));
  const list = block.slice(block.indexOf('list: ['), block.indexOf(']', block.indexOf('list: [')));
  const inSchema = [...list.matchAll(/value: '([a-z]+)'/g)].map((m) => m[1]);

  const expected = [...SCHREIBBAR_KINDS.map((k) => k.value), ...DENKBAR_KINDS];
  assert.deepEqual([...inSchema].sort(), [...expected].sort());
});
