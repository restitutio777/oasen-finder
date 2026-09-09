import { test } from 'node:test';
import assert from 'node:assert/strict';
import { availableTranslations, extractTitleLine, hasVisibleText } from './translations.js';

/** Kurzschreibweise für einen Portable-Text-Block. */
const block = (...spans) => ({
  _type: 'block',
  style: 'normal',
  children: spans.map(([text, marks = []]) => ({ _type: 'span', text, marks })),
});

test('ohne Übersetzung passiert nichts', () => {
  assert.deepEqual(availableTranslations({ de: [block(['Hallo'])] }), []);
  assert.deepEqual(availableTranslations(undefined), []);
  assert.deepEqual(availableTranslations(null, null), []);
});

test('leer aufgeklapptes Studio-Feld zählt nicht als Übersetzung', () => {
  // Katharina klappt „Übersetzungen" auf und wieder zu — Sanity legt dann
  // leere Blöcke an. Sonst stünde ein leerer Aufklapper auf der Seite.
  assert.equal(hasVisibleText([block([''])]), false);
  assert.equal(hasVisibleText([block(['  ']), block([''])]), false);
  assert.deepEqual(availableTranslations({ en: [block([''])] }), []);
});

test('fette erste Zeile wird Titel und verschwindet aus dem Text', () => {
  // Der reale Fall „Pancho's Garten": Titel fett obendrüber, im selben Block.
  const body = { en: [block(['Green Magic\n', ['strong']], ['\nAnyone who travels…'])] };
  const [t] = availableTranslations(body);
  assert.equal(t.heading, 'Green Magic');
  assert.equal(t.hasTitle, true);
  assert.equal(t.anchor, 'uebersetzung-en');
  assert.equal(t.blocks[0].children[0].text, 'Anyone who travels…');
  assert.equal(JSON.stringify(t.blocks).includes('Green Magic'), false);
});

test('Gedicht: unmarkierte erste Zeile bleibt Verszeile', () => {
  // wonder „vertraue" — die erste Zeile ist Teil des Gedichts, kein Titel.
  const body = { en: [block(['I trust your love \nto carry the memory of me'])] };
  const [t] = availableTranslations(body);
  assert.equal(t.heading, 'English version');
  assert.equal(t.hasTitle, false);
  assert.equal(t.blocks[0].children[0].text.startsWith('I trust your love'), true);
});

test('ganzer fetter Absatz ist kein Titel', () => {
  const lang = 'x'.repeat(130);
  const [t] = availableTranslations({ en: [block([lang, ['strong']])] });
  assert.equal(t.hasTitle, false);
  assert.equal(t.blocks[0].children[0].text, lang);
});

test('ausgefülltes Titelfeld gewinnt und der Text bleibt unangetastet', () => {
  const body = { en: [block(['Bold opener\n', ['strong']], ['\nText'])] };
  const [t] = availableTranslations(body, { en: '  Proper Title  ' });
  assert.equal(t.heading, 'Proper Title');
  assert.equal(t.hasTitle, true);
  assert.equal(t.blocks[0].children[0].text, 'Bold opener\n');
});

test('Titelblock ohne Resttext fällt ganz weg', () => {
  const body = { en: [block(['Only The Title', ['strong']]), block(['Der Text'])] };
  const [t] = availableTranslations(body);
  assert.equal(t.heading, 'Only The Title');
  assert.equal(t.blocks.length, 1);
  assert.equal(t.blocks[0].children[0].text, 'Der Text');
});

test('Originaldaten werden nie verändert', () => {
  // Die Blöcke kommen aus dem Sanity-Cache und werden von mehreren Seiten
  // benutzt — eine Mutation hier würde an ganz anderer Stelle auffallen.
  const body = { en: [block(['Titel\n', ['strong']], ['\nText'])] };
  const vorher = JSON.stringify(body);
  availableTranslations(body);
  assert.equal(JSON.stringify(body), vorher);
});

test('Bild als erster Block zählt als Inhalt und stürzt nicht ab', () => {
  const body = { en: [{ _type: 'image', asset: { _ref: 'image-abc-100x100-jpg' } }] };
  const [t] = availableTranslations(body);
  assert.equal(t.hasTitle, false);
  assert.equal(t.blocks.length, 1);
});

test('Französisch bekommt eigene Beschriftung und eigenen Anker', () => {
  const body = { fr: [block(['Un titre\n', ['strong']], ['\nLe texte'])] };
  const [t] = availableTranslations(body);
  assert.equal(t.locale, 'fr');
  assert.equal(t.anchor, 'uebersetzung-fr');
  assert.equal(t.invitation, 'Également disponible en français');
  assert.equal(t.heading, 'Un titre');
});

test('Englisch und Französisch nebeneinander', () => {
  const body = { en: [block(['English'])], fr: [block(['Français'])] };
  assert.deepEqual(availableTranslations(body).map((t) => t.locale), ['en', 'fr']);
});

test('kaputte Blöcke werfen keinen Fehler', () => {
  // Alles, was ein Build zum Absturz bringen könnte — der Fall vom 05.08.
  // hat gezeigt, was ein einziger unerwarteter Wert anrichtet.
  assert.doesNotThrow(() => availableTranslations({ en: 'kein Array' }));
  assert.doesNotThrow(() => availableTranslations({ en: [null, undefined] }));
  assert.doesNotThrow(() => extractTitleLine([]));
  assert.doesNotThrow(() => extractTitleLine([{ _type: 'block' }]));
  assert.doesNotThrow(() => extractTitleLine([{ _type: 'block', children: [{}] }]));
});
