/* Прогон приложения в настоящем браузере: то, что нельзя проверить без DOM —
   разметка, обработчики, отрисовка на канвасе, экспорт файла.
 *
 *   node scripts/smoke.mjs
 *
 * Модульные тесты (npm test) закрывают логику; здесь проверяется, что она
 * действительно подключена к странице. Браузер запускается headless и ищется
 * среди chromium/chrome; если его нет — прогон пропускается с явным сообщением. */

import { spawn, execSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 9333;
const BROWSERS = ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'];

function findBrowser() {
  for (const name of BROWSERS) {
    try {
      return execSync(`command -v ${name}`, { encoding: 'utf8' }).trim();
    } catch (error) {
      /* пробуем следующий */
    }
  }
  return null;
}

/* Сценарий выполняется внутри страницы. Возвращает список проверок:
   каждая — [название, прошла ли, что получилось]. */
const SCENARIO = `(async () => {
  const $ = id => document.getElementById(id);
  const checks = [];
  const check = (name, ok, detail) => checks.push([name, !!ok, detail === undefined ? '' : String(detail)]);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  localStorage.clear();

  check('страница собралась', !!$('canvas') && !!$('panelBody'));
  check('шаблоны отрисованы', $('presets').children.length > 0, $('presets').children.length);
  check('форматы отрисованы', $('formats').children.length > 0, $('formats').children.length);

  // картинка приходит перетаскиванием — обычный путь пользователя
  const source = document.createElement('canvas');
  source.width = 2400; source.height = 1600;
  const paint = source.getContext('2d');
  paint.fillStyle = '#2b4a5e'; paint.fillRect(0, 0, 2400, 1600);
  paint.fillStyle = '#e8e5e0'; paint.fillRect(600, 400, 1200, 800);
  const blob = await new Promise(r => source.toBlob(r, 'image/png'));
  const data = new DataTransfer();
  data.items.add(new File([blob], 'photo.png', { type: 'image/png' }));
  $('canvas').dispatchEvent(new DragEvent('drop', { dataTransfer: data, bubbles: true }));
  await wait(400);
  check('картинка загрузилась', $('fileName').textContent === 'photo.png', $('fileName').textContent);
  check('кадр нарисован', $('cv').getContext('2d').getImageData(5, 5, 1, 1).data[3] === 255);

  // холст и кадр
  document.querySelector('[data-preset="story"]').click();
  check('шаблон применился', $('headSize').textContent === '1080×1920', $('headSize').textContent);
  $('zoom').value = 140; $('zoom').dispatchEvent(new Event('input'));
  check('приближение сработало', $('badgeZoom').textContent === '140%', $('badgeZoom').textContent);
  check('запас качества посчитан', $('qualityHint').className.includes('warn'), $('qualityHint').className);

  // вызов чужого модуля через контракт
  $('trimFit').click();
  check('подгонка холста под картинку', $('headSize').textContent === '1080×720', $('headSize').textContent);

  // экспорт: файл действительно собирается
  let downloaded = null;
  const click = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { downloaded = this.download; };
  $('export').click();
  await wait(600);
  HTMLAnchorElement.prototype.click = click;
  check('файл отдан пользователю', downloaded === 'cover-1080x720.jpg', downloaded);

  // панель
  document.querySelector('[data-block="size"] .block__head').click();
  check('блок свернулся', !document.querySelector('[data-block="size"]').classList.contains('block--open'));
  $('panelToggle').click();
  check('панель свернулась', $('panel').classList.contains('panel--closed'));
  $('panelToggle').click();

  // язык и тема
  $('prefsBtn').click();
  $('langSelect').value = 'en'; $('langSelect').dispatchEvent(new Event('change'));
  check('язык переключился', document.querySelector('.head__title').textContent === 'Cropper',
        document.querySelector('.head__title').textContent);
  $('themeSelect').value = 'light'; $('themeSelect').dispatchEvent(new Event('change'));
  await wait(400);
  const background = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  check('тема переключилась', background !== '#0c0c0e', background);

  // память между запусками: каждый модуль пишет свой ключ
  const keys = Object.keys(localStorage).sort();
  check('состояние сохранено по модулям', keys.length >= 5, keys.join(', '));

  return checks;
})()`;

const browser = findBrowser();
if (!browser) {
  console.log('браузер не найден (' + BROWSERS.join(', ') + ') — прогон пропущен');
  process.exit(0);
}

const profile = mkdtempSync(join(tmpdir(), 'cropper-smoke-'));
const child = spawn(browser, [
  '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--window-size=1440,900', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  'about:blank'
], { stdio: 'ignore' });

const stop = code => {
  child.kill();
  /* профиль браузера может ещё дописываться — уборка не влияет на итог */
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  } catch (error) {
    /* временный каталог подчистит система */
  }
  process.exit(code);
};

async function connect() {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (response.ok) return;
    } catch (error) {
      /* ещё не поднялся */
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('браузер не открыл порт отладки');
}

try {
  await connect();
  const url = pathToFileURL(join(ROOT, 'index.html')).href;
  const target = await (await fetch(
    `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' }
  )).json();

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  const failures = [];
  let id = 0;

  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
    if (message.method === 'Runtime.exceptionThrown') {
      failures.push('ошибка на странице: ' +
        (message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text));
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      failures.push('console.error: ' + message.params.args.map(a => a.value ?? a.description).join(' '));
    }
  });

  const send = (method, params = {}) => new Promise(resolve => {
    const message_id = ++id;
    pending.set(message_id, resolve);
    socket.send(JSON.stringify({ id: message_id, method, params }));
  });

  await new Promise(resolve => socket.addEventListener('open', resolve));
  await send('Runtime.enable');
  await send('Page.enable');
  await new Promise(resolve => setTimeout(resolve, 1200));

  const result = await send('Runtime.evaluate', {
    expression: SCENARIO, awaitPromise: true, returnByValue: true
  });

  if (result.result?.exceptionDetails) {
    failures.push('сценарий упал: ' + (result.result.exceptionDetails.exception?.description || ''));
  }

  const checks = result.result?.result?.value || [];
  for (const [name, ok, detail] of checks) {
    console.log(`${ok ? '  ok' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
    if (!ok) failures.push(name);
  }

  console.log(`\nпроверок: ${checks.length}, не прошло: ${failures.length}`);
  failures.forEach(line => console.log('  ' + line));
  stop(failures.length ? 1 : 0);
} catch (error) {
  console.error('прогон не удался:', error.message);
  stop(1);
}
