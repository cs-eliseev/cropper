/* Контрактный тест порта хранилища. Его проходят и настоящий адаптер,
   и заглушки, которыми пользуются другие модули: иначе тест на заглушке
   ничего не значит. */

import { test } from 'node:test';
import assert from 'node:assert/strict';

/**
 * @param {string} name как называется реализация в отчёте
 * @param {() => object} create собирает реализацию KeyValueStorageInterface
 */
export function runKeyValueStorageContract(name, create) {
  test(`${name}: контракт хранилища`, async t => {
    await t.test('чего не клали, того и нет', () => {
      assert.equal(create().get('missing'), undefined);
      assert.equal(create().get('missing', 'по умолчанию'), 'по умолчанию');
    });

    await t.test('что положили, то и достаём', () => {
      const storage = create();
      storage.set('canvas', { width: 1080, height: 1920 });
      assert.deepEqual(storage.get('canvas'), { width: 1080, height: 1920 });
    });

    await t.test('запись сообщает об успехе', () => {
      assert.equal(typeof create().set('key', 1), 'boolean');
    });

    await t.test('удалённого больше нет', () => {
      const storage = create();
      storage.set('key', 'значение');
      storage.remove('key');
      assert.equal(storage.get('key', 'нет'), 'нет');
    });

    await t.test('удаление того, чего нет, не роняет', () => {
      assert.doesNotThrow(() => create().remove('missing'));
    });

    await t.test('значения не делятся между экземплярами', () => {
      create().set('key', 'первое');
      assert.equal(create().get('key', 'пусто'), 'пусто');
    });
  });
}
