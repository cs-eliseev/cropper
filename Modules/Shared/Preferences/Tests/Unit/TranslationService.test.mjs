/* Чистая логика перевода: цепочка словарей и подстановки. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';
import { RU, EN } from '../Doubles/PreferencesDoubles.mjs';

const { TranslationService } = app;
const service = new TranslationService();

test('берёт строку из первого словаря цепочки', () => {
  assert.equal(service.translate([RU, EN], 'save'), 'Скачать');
  assert.equal(service.translate([EN, RU], 'save'), 'Download');
});

test('чего нет в переводе — берётся из запасного', () => {
  assert.equal(service.translate([RU, EN], 'done'), 'Done');
});

test('незнакомый ключ возвращается как есть — интерфейс не пустеет', () => {
  assert.equal(service.translate([RU, EN], 'нет-такого'), 'нет-такого');
});

test('подстановки заменяются везде', () => {
  assert.equal(service.translate([RU], 'pcs', { n: 3 }), '3 шт');
  const service_all = new TranslationService();
  const dictionary = [{ strings: { line: '{a} и {a}, потом {b}' } }];
  assert.equal(service_all.translate(dictionary, 'line', { a: 'раз', b: 'два' }), 'раз и раз, потом два');
});

test('пустая цепочка не роняет', () => {
  assert.equal(service.translate([], 'save'), 'save');
  assert.equal(service.translate([null, undefined, RU], 'save'), 'Скачать');
});
