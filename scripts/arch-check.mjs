/* Проверка границ модулей. Заменяет import-linter из скилла: импортов в этом
   проекте нет — классы живут в общей области видимости и связываются порядком
   подключения в index.html, поэтому связи ищутся по именам, которые файл
   упоминает.
 *
 *   node scripts/arch-check.mjs
 *
 * Что проверяется:
 *   1  чужой модуль виден только через Contracts/ Events/ DTO/ Enums/ Exceptions/
 *   2  Core не знает про модули; в Core нет Actions
 *   3  зависимости идут вниз: Modules → Shared → Infrastructure → Core → kernel
 *   4  один файл действия = один класс *Action с единственным публичным run()
 *  14  DTO, VO, Event и Exception заморожены в конструкторе
 *  15  имя файла совпадает с именем класса, суффикс соответствует роли
 *   +  каждое имя, которое файл упоминает, где-то объявлено (опечатки)
 *   +  у каждого контракта есть токен для контейнера
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename, dirname, sep } from 'node:path';

const ROOTS = ['kernel', 'Core', 'Modules'];
/* публичная поверхность модуля: правило 1 плюс VO — скилл разрешает его
   как payload контракта («Payload = DTO/VO/primitives») */
const PUBLIC_ROLES = ['Contracts', 'Events', 'DTO', 'Enums', 'Exceptions', 'VO'];
/* Core существует, чтобы им пользовались: его чистая логика и словари открыты,
   а вот адаптеры хранилищ — только для композиционного корня */
const CORE_OPEN_ROLES = PUBLIC_ROLES.concat(['Services', 'Dictionaries', 'Interactors', 'Entities']);
/* композиционный корень связывает слои по определению */
const COMPOSITION_ROOTS = ['kernel/Bootstrap.js'];
/* имена, по которым видно роль: только их проверяем на «объявлено ли где-то» */
const ROLE_NAME = /(Action|Interface|Token|DTO|VO|Event|Service|Repository|Gateway|View|Controller|Provider|Exception|Mapper|Facade|Interactor|Dictionary|Specification|Factory|Subscriber|Listener)$/;
const ROLE_SUFFIX = {
  Actions: 'Action', Interactors: 'Interactor', Services: 'Service', Repositories: 'Repository',
  Gateways: 'Gateway', Converters: 'Mapper', Facades: 'Facade', Factories: 'Factory',
  Specifications: 'Specification', Dictionaries: 'Dictionary', Listeners: null,
  Providers: 'Provider', Contracts: null, Events: 'Event', DTO: 'DTO', VO: 'VO',
  Enums: 'Enum', Exceptions: 'Exception', Entities: 'Entity',
  Controllers: 'Controller', Views: 'View', ACL: 'Translator'
};
const FROZEN_ROLES = ['DTO', 'VO', 'Events', 'Exceptions'];

/* имена платформы: браузер, стандартная библиотека, ядро приложения */
const BUILTIN = new Set([
  'Object', 'Array', 'Math', 'JSON', 'Number', 'String', 'Boolean', 'Symbol', 'Map', 'Set',
  'Date', 'Promise', 'Error', 'TypeError', 'RangeError', 'Function', 'RegExp', 'Infinity', 'NaN',
  'Blob', 'File', 'FileReader', 'Image', 'URL', 'Event', 'DragEvent', 'DataTransfer',
  'ResizeObserver', 'HTMLElement', 'HTMLLinkElement', 'HTMLStyleElement', 'HTMLSelectElement',
  'HTMLButtonElement', 'HTMLInputElement', 'CanvasRenderingContext2D', 'CanvasImageSource',
  'Container', 'EventBus', 'Bootstrap'
]);

const files = [];
const tests = [];
const walk = dir => readdirSync(dir).forEach(name => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) walk(path);
  else if (name.endsWith('.js')) files.push(path);
  else if (name.endsWith('.mjs')) tests.push(path);
});
ROOTS.forEach(walk);

/* комментарии и строковые литералы не создают связей между модулями */
const stripComments = text => text
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
  .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
  .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
  .replace(/`(?:[^`\\]|\\.)*`/g, '``');

/** слой и модуль по пути файла */
function locate(path) {
  const parts = path.split(sep);
  if (parts[0] === 'kernel') return { layer: 0, module: 'kernel', role: null };
  const module = parts.slice(0, 3).join('/');
  const role = parts[3] === 'Ui' ? parts[4] : parts[3];
  if (parts[0] === 'Core') return { layer: 1, module, role };
  const context = parts[1];
  const layer = context === 'Infrastructure' ? 2 : context === 'Shared' ? 3 : 4;
  return { layer, module, role };
}

const declared = new Map();          // имя → {path, module, role, layer}
const bodies = new Map();

for (const path of files) {
  const raw = readFileSync(path, 'utf8');
  const code = stripComments(raw);
  bodies.set(path, { raw, code, ...locate(path) });
  for (const match of code.matchAll(/^(?:class|const|function)\s+([A-Z][A-Za-z0-9_]*)/gm)) {
    declared.set(match[1], { path, ...locate(path) });
  }
}

const problems = [];
const report = (path, rule, message) => problems.push(`${path} → правило ${rule}: ${message}`);

/* базовое исключение модуля — родитель для остальных, замораживать его нельзя:
   поля выставляют наследники */
const baseExceptions = new Set();
for (const file of bodies.values()) {
  for (const match of file.code.matchAll(/^class\s+[A-Za-z0-9_]+\s+extends\s+([A-Za-z0-9_]+)/gm)) {
    baseExceptions.add(match[1]);
  }
}

for (const [path, file] of bodies) {
  const name = basename(path, '.js');
  const role = file.role;
  const is_kernel = file.layer === 0;
  const is_root = COMPOSITION_ROOTS.includes(path.split(sep).join('/'));

  /* 15 — имя файла = имя класса */
  if (is_kernel && !is_root) continue;
  if (!new RegExp(`^(class|const|function)\\s+${name}\\b`, 'm').test(file.code)) {
    report(path, 15, `файл не объявляет ${name}`);
  }

  /* 15 — суффикс роли */
  const suffix = ROLE_SUFFIX[role];
  if (suffix && !name.endsWith(suffix)) report(path, 15, `${name} лежит в ${role}/, нужен суффикс ${suffix}`);
  if (role === 'Contracts' && !name.endsWith('Interface')) {
    report(path, 15, `${name} лежит в Contracts/, нужен суффикс Interface`);
  }

  /* контракт объявляет токен для контейнера */
  if (role === 'Contracts' && !file.code.includes(`${name.replace(/Interface$/, '')}Token`)) {
    report(path, 7, `у контракта ${name} нет токена ${name.replace(/Interface$/, '')}Token`);
  }

  /* 4 — действие: один класс, один публичный run() */
  if (role === 'Actions') {
    const classes = [...file.code.matchAll(/^class\s+([A-Z][A-Za-z0-9_]*)/gm)];
    if (classes.length !== 1) report(path, 4, `в файле ${classes.length} классов, нужен один`);
    const methods = [...file.code.matchAll(/^ {2}(?:async\s+)?([a-zA-Z][A-Za-z0-9_]*)\s*\(/gm)]
      .map(m => m[1])
      .filter(m => m !== 'constructor');
    const publics = methods.filter(m => !m.startsWith('#'));
    if (!publics.includes('run')) report(path, 4, 'нет публичного run()');
    if (publics.length > 1) report(path, 4, `публичных методов больше одного: ${publics.join(', ')}`);
  }

  /* 2 — в Core нет действий, оркестрация только через execute() */
  if (file.layer === 1 && role === 'Actions') report(path, 2, 'в Core не должно быть Actions');
  if (role === 'Interactors' && !/^ {2}execute\s*\(/m.test(file.code)) {
    report(path, 2, 'у Interactor должен быть execute()');
  }

  /* 14 — значения заморожены (кроме базовых классов: их поля ставят наследники) */
  if (FROZEN_ROLES.includes(role) && !baseExceptions.has(name)
      && !file.code.includes('Object.freeze(this)')) {
    report(path, 14, `${role}/${name} не заморожен в конструкторе`);
  }

  /* 1, 2, 3 — связи */
  const used = new Set(
    [...file.code.matchAll(/\b([A-Z][A-Za-z0-9_]*)\b/g)].map(match => match[1])
  );
  for (const identifier of used) {
    if (BUILTIN.has(identifier) || identifier === name) continue;
    const target = declared.get(identifier);
    if (!target) {
      if (ROLE_NAME.test(identifier)) report(path, '—', `${identifier} нигде не объявлен`);
      continue;
    }
    if (target.module === file.module || is_root) continue;
    if (target.layer === 0) continue;                    // ядро доступно всем слоям
    if (target.layer > file.layer) {
      report(path, 3, `${identifier} из ${target.module}: зависимость вверх`);
      continue;
    }
    if (file.layer === 1 && target.layer > 1) report(path, 2, `Core тянет ${identifier} из ${target.module}`);
    const open = target.layer === 1 ? CORE_OPEN_ROLES : PUBLIC_ROLES;
    if (!open.includes(target.role)) {
      report(path, 1, `${identifier} — ${target.role}/ модуля ${target.module}, не публичная поверхность`);
    }
  }
}

/* 16 — тесты модуля A не лезут во внутренности модуля B.
   Через границу видны только публичные роли и опубликованные заглушки
   с контрактными тестами (Tests/Doubles/, Tests/Contracts/). */
for (const path of tests) {
  const posix = path.split(sep).join('/');
  const file = locate(path);
  const code = stripComments(readFileSync(path, 'utf8'));

  for (const match of code.matchAll(/from\s+'([^']+)'/g)) {
    const target = match[1];
    if (!target.includes('..')) continue;
    const reaches_module = /(kernel|Core|Modules)\//.test(target);
    const is_published = target.includes('/Tests/Doubles/') || target.includes('/Tests/Contracts/');
    if (reaches_module && !is_published) {
      report(posix, 16, `тест тянет ${target} — не заглушку и не контрактный тест`);
    }
  }

  for (const match of code.matchAll(/\b([A-Z][A-Za-z0-9_]*)\b/g)) {
    const identifier = match[1];
    if (BUILTIN.has(identifier)) continue;
    const target = declared.get(identifier);
    if (!target || target.layer === 0 || target.module === file.module) continue;
    const open = target.layer === 1 ? CORE_OPEN_ROLES : PUBLIC_ROLES;
    if (!open.includes(target.role)) {
      report(posix, 16, `${identifier} — ${target.role}/ модуля ${target.module}, тесту не видно`);
    }
  }
}

console.log(`проверено файлов: ${files.length}, тестов: ${tests.length}`);
if (!problems.length) {
  console.log('нарушений нет');
  process.exit(0);
}
problems.forEach(line => console.log('  ' + line));
console.log(`\nнарушений: ${problems.length}`);
process.exit(1);
