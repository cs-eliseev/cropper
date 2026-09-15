/* Контракт перевода: им пользуются все модули, поэтому заглушки в их тестах
   обязаны вести себя так же, как настоящая реализация. */

import { test } from 'node:test';
import assert from 'node:assert/strict';

/**
 * @param {string} name
 * @param {() => object} create реализация TranslatorInterface
 */
export function runTranslatorContract(name, create) {
  test(`${name}: контракт перевода`, async t => {
    await t.test('всегда возвращает строку', () => {
      assert.equal(typeof create().translate('save'), 'string');
      assert.equal(typeof create().translate('ключа-нет'), 'string');
    });

    await t.test('незнакомый ключ не роняет и не пустеет', () => {
      assert.ok(create().translate('совсем-незнакомый-ключ').length > 0);
    });

    await t.test('подстановки принимаются', () => {
      assert.equal(typeof create().translate('pcs', { n: 3 }), 'string');
    });
  });
}
