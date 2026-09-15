/* Разбор файла словаря: .json и .js — одна и та же запись. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';
import { FakeTextFileReader } from '../Doubles/PreferencesDoubles.mjs';

const { LanguageFileMapper, LanguageFileException, LanguageDTO } = app;
const mapper = new LanguageFileMapper();

const file = async (name, text) => (await FakeTextFileReader.withText(name, text).pickText());

test('json превращается в словарь', async () => {
  const source = JSON.stringify({ code: 'es', name: 'Español', strings: { save: 'Descargar' } });
  const language = mapper.toLanguage(await file('es.json', source));
  assert.ok(language instanceof LanguageDTO);
  assert.equal(language.code, 'es');
  assert.equal(language.strings.save, 'Descargar');
  assert.equal(language.dir, 'ltr');
  assert.ok(Object.isFrozen(language));
});

test('js читается как тот же объект', async () => {
  const source = "App.lang({ code:'de', name:'Deutsch', strings:{ save:'Herunterladen' } });";
  const language = mapper.toLanguage(await file('de.js', source));
  assert.equal(language.code, 'de');
  assert.equal(language.strings.save, 'Herunterladen');
});

test('направление письма переносится', async () => {
  const source = JSON.stringify({ code: 'he', name: 'עברית', dir: 'rtl', strings: { save: 'הורדה' } });
  assert.equal(mapper.toLanguage(await file('he.json', source)).dir, 'rtl');
});

test('битый json — доменная ошибка с именем файла', async () => {
  await assert.rejects(async () => mapper.toLanguage(await file('bad.json', '{не json')),
    error => {
      assert.ok(error instanceof LanguageFileException);
      assert.equal(error.file_name, 'bad.json');
      assert.ok(error.reason.length > 0);
      return true;
    });
});

test('словарь без кода не принимается', async () => {
  await assert.rejects(async () => mapper.toLanguage(await file('no-code.json', '{"strings":{}}')),
    LanguageFileException);
});

test('js без вызова App.lang не принимается', async () => {
  await assert.rejects(async () => mapper.toLanguage(await file('empty.js', 'const x = 1;')),
    LanguageFileException);
});

test('падение внутри js заворачивается в доменную ошибку', async () => {
  await assert.rejects(async () => mapper.toLanguage(await file('boom.js', 'throw new Error("бум")')),
    LanguageFileException);
});
