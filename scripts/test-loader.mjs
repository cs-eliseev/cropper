/* Загрузчик приложения для тестов.

   В браузере классы живут в общей области видимости, а порядок задаёт
   index.html. Здесь тот же порядок вычитывается из разметки, файлы
   выполняются в одном контексте `node:vm` — и все объявленные имена
   отдаются тестам. Никакой сборки и никаких зависимостей.

   Точка входа приложения (main.js) не выполняется: она поднимает интерфейс
   и требует настоящий DOM. Тесты собирают нужные классы руками — так же,
   как это делает провайдер модуля. */

import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = ['main.js'];

/** @returns {string[]} пути скриптов в порядке подключения */
function scriptOrder() {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  return [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]
    .map(match => match[1])
    .filter(path => !SKIP.includes(path));
}

/* Минимальная платформа: то, чем пользуются классы, которые тесты собирают
   без DOM. Всё остальное подменяется заглушками в самих тестах. */
function browserStub() {
  const noop = () => {};
  const element = () => ({
    style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    appendChild: noop, querySelector: () => null, querySelectorAll: () => [],
    setAttribute: noop, getAttribute: () => null, addEventListener: noop, click: noop,
    textContent: '', innerHTML: '', hidden: false
  });
  return {
    document: {
      documentElement: element(),
      createElement: element,
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: noop
    },
    navigator: { language: 'ru' },
    location: { reload: noop },
    alert: noop,
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    requestAnimationFrame: callback => { callback(0); return 0; },
    cancelAnimationFrame: noop,
    localStorage: null
  };
}

let cached = null;
let sandbox_ref = null;

/* Стенд платформы: тесты подменяют здесь localStorage, document и прочее,
   потому что приложение выполняется в своём контексте vm и глобальные
   объекты Node ему не видны. */
export function platform() {
  loadApp();
  return sandbox_ref;
}

/** @returns {object} все объявленные приложением имена */
export function loadApp() {
  if (cached) return cached;

  const stub = browserStub();
  const sandbox = Object.assign({
    console, setTimeout, clearTimeout, setInterval, clearInterval,
    URL, Blob, TextEncoder, TextDecoder, Promise, Symbol, Math, JSON, Date
  }, stub);
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox_ref = sandbox;
  const context = createContext(sandbox);

  const names = new Set();
  for (const path of scriptOrder()) {
    const code = readFileSync(join(ROOT, path), 'utf8');
    try {
      runInContext(code, context, { filename: path });
    } catch (error) {
      throw new Error(`не выполнился ${path}: ${error.message}`, { cause: error });
    }
    for (const match of code.matchAll(/^(?:class|const|function)\s+([A-Za-z_][A-Za-z0-9_]*)/gm)) {
      names.add(match[1]);
    }
  }

  /* имена объявлены лексически и на глобальном объекте не видны —
     забираем их выражением, выполненным в том же контексте */
  cached = runInContext(`({ ${[...names].join(', ')} })`, context);
  return cached;
}

export const app = loadApp();

/* Объекты, созданные внутри vm, имеют свой Object.prototype, поэтому
   assert.deepStrictEqual считает их непохожими на обычные. Для сравнения
   структуры прогоняем значение через JSON. */
export function plain(value) {
  return JSON.parse(JSON.stringify(value));
}
