# Cropper

Кадрирование картинок в браузере. Без сборки и без зависимостей: страница
открывается с диска (`file://`) и работает офлайн — это ограничение важнее
удобства инструментов разработки, потому что им пользуются как обычным файлом.

## Architecture: modular monolith

This project is a modular monolith with vertical slices. Modules live in
`Modules/<Context>/<Name>/`; shared kernel in `Core/`. Rules, component roles,
naming and code style are defined by the `modular-monolith` skill.

Use the skill before you: create or change a module; add a class and need to
pick its role (Action, DTO, Repository, Gateway, ...); make one module call or
read another; review a change for boundary violations.

Project specifics:
- Language / framework: browser JavaScript, no bundler, no framework.
  Language rules follow `references/lang/javascript.md` (`Object.freeze`,
  `#fields`, contract + `Symbol` token, enum as a frozen object); the Node.js
  half of that file does not apply — see "Отступления" below.
- Modules root: `Modules/`; Core root: `Core/`; framework layer: `kernel/`.
- Composition root: `main.js` (settings from `config.js`) + `kernel/Bootstrap.js`.
- Enforcement command: `npm run check` (`arch-check.mjs` + `node --test`)
- Browser end-to-end: `npm run smoke`
- Тесты гоняют тот же код, что открывается с диска: `scripts/test-loader.mjs`
  читает порядок скриптов из `index.html` и выполняет их в контексте `node:vm`.
  Чужие модули в тестах — только заглушками из их `Tests/Doubles/`, и эти
  заглушки обязаны проходить контрактные тесты владельца.

### Отступления от скилла

Заявлены осознанно, каждое — из-за среды, а не из-за удобства.

| Правило | Отступление | Почему |
|---|---|---|
| `lang/javascript.md`: ESM, `@ts-check`, `tsc --noEmit`, dependency-cruiser | классы объявляются в общей области видимости, порядок задаёт `index.html`; типы — JSDoc без проверки; границы проверяет `scripts/arch-check.mjs` | ES-модули на `file://` запрещены CORS: страница перестала бы открываться с диска |
| 6 — `actor` первым параметром, проверка прав в действии | действия принимают только DTO | однопользовательский инструмент на своей машине: ни аутентификации, ни арендаторов |
| 8, 13 — `tenant_id` в событиях, фильтр по арендатору | событие несёт только `occurred_at` | там же |
| 12 — транзакции, Outbox, идемпотентные Job | нет | нет ни транзакционного хранилища, ни очередей |
| 16 — тесты внутри модуля | выполняется: `Modules/<M>/Tests/{Unit,Feature,Contracts,Doubles}`, запуск `npm test` | — |
| 3 — точка входа зовёт ровно одно действие | `Ui/Views/` перерисовываются слушателями напрямую, минуя действие | отрисовка не бизнес-операция; `Http/Resources` из скилла здесь и есть `Ui/Views/` |

Роли точек входа переименованы под среду: `Http/Controllers/` → `Ui/Controllers/`
(события разметки), `Http/Resources/` → `Ui/Views/` (адаптер вывода).
