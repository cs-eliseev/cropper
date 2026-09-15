/* Настоящий адаптер к localStorage — на подменённом хранилище браузера. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app, platform } from '#app';
import { runKeyValueStorageContract } from '../Contracts/KeyValueStorageContractTest.mjs';
import { InMemoryKeyValueStorage } from '../Doubles/InMemoryKeyValueStorage.mjs';

const { LocalStorageGateway } = app;

/* стенд вместо localStorage браузера */
function browserStorage() {
  const values = new Map();
  return {
    values,
    getItem: key => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

/* localStorage внутри загруженного приложения подменяется на время теста */
function withStorage(prefix = 'test') {
  const browser = browserStorage();
  platform().localStorage = browser;
  return { gateway: new LocalStorageGateway(prefix), browser };
}

runKeyValueStorageContract('LocalStorageGateway', () => withStorage().gateway);
runKeyValueStorageContract('InMemoryKeyValueStorage', () => new InMemoryKeyValueStorage());

test('ключи получают префикс приложения', () => {
  const { gateway, browser } = withStorage('cropper');
  gateway.set('canvas', 1);
  assert.deepEqual([...browser.values.keys()], ['cropper.canvas']);
});

test('запрет на запись не роняет приложение', () => {
  platform().localStorage = {
    getItem: () => { throw new Error('приватный режим'); },
    setItem: () => { throw new Error('приватный режим'); },
    removeItem: () => { throw new Error('приватный режим'); }
  };
  const gateway = new LocalStorageGateway('cropper');
  assert.equal(gateway.set('key', 1), false);
  assert.equal(gateway.get('key', 'запасное'), 'запасное');
  assert.doesNotThrow(() => gateway.remove('key'));
});

test('битое значение читается как отсутствующее', () => {
  const browser = browserStorage();
  browser.setItem('cropper.canvas', '{не json');
  platform().localStorage = browser;
  assert.equal(new LocalStorageGateway('cropper').get('canvas', 'запасное'), 'запасное');
});
