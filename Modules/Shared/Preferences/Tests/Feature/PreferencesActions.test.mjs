/* Действия настроек: словари и темы на хранилище в памяти,
   файлы и таблицы стилей — заглушками. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';
import { SpyEventBus } from '../../../../../kernel/Tests/Doubles/SpyEventBus.mjs';
import { InMemoryKeyValueStorage } from '../../../../../Core/Storage/KeyValue/Tests/Doubles/InMemoryKeyValueStorage.mjs';
import { runTranslatorContract } from '../Contracts/TranslatorContractTest.mjs';
import {
  FakeTextFileReader, FakeFileWriter, fakeStyleSheets, RU, EN, DARK, LIGHT
} from '../Doubles/PreferencesDoubles.mjs';

const {
  LanguageRepository, ThemeRepository, TranslationService, TranslatorFacade,
  LanguageFileMapper, StyleSheetGateway,
  SwitchLanguageAction, ImportLanguageAction, ExportLanguageTemplateAction,
  SwitchThemeAction, ImportThemeAction, ResetPreferencesAction,
  SwitchLanguageDTO, SwitchThemeDTO, LanguageChangedEvent, ThemeChangedEvent,
  PreferencesDictionary
} = app;

function build({ preferred = 'ru', reader = FakeTextFileReader.empty(), saved = {}, writable = true } = {}) {
  const storage = new InMemoryKeyValueStorage(writable);
  Object.keys(saved).forEach(key => storage.set(key, saved[key]));
  const languages = new LanguageRepository(storage, [RU, EN], 'en', preferred);
  const themes = new ThemeRepository(storage, [DARK, LIGHT], 'dark', PreferencesDictionary.CUSTOM_THEME_NAME_KEY);
  const sheets_nodes = fakeStyleSheets();
  const sheets = new StyleSheetGateway(sheets_nodes.link, sheets_nodes.style);
  const events = new SpyEventBus();
  const writer = new FakeFileWriter();

  return {
    storage, languages, themes, events, sheets_nodes, writer, reader,
    translator: new TranslatorFacade(languages, new TranslationService()),
    switchLanguage: new SwitchLanguageAction(languages, events),
    importLanguage: new ImportLanguageAction(reader, languages, new LanguageFileMapper(), events),
    exportTemplate: new ExportLanguageTemplateAction(languages, writer),
    switchTheme: new SwitchThemeAction(themes, sheets, events),
    importTheme: new ImportThemeAction(reader, themes, sheets, events),
    reset: new ResetPreferencesAction(themes)
  };
}

runTranslatorContract('TranslatorFacade', () => build().translator);

test('язык по умолчанию берётся из настроек', () => {
  assert.equal(build({ preferred: 'en' }).languages.getCurrent().code, 'en');
});

test('выбор пользователя сильнее настроек и переживает перезапуск', () => {
  const first = build({ preferred: 'ru' });
  first.switchLanguage.run(new SwitchLanguageDTO('en'));
  assert.equal(first.languages.getCurrent().code, 'en');

  const second = build({ preferred: 'ru', saved: { lang: 'en' } });
  assert.equal(second.languages.getCurrent().code, 'en');
});

test('смена языка публикует событие с кодом и направлением', () => {
  const module = build();
  module.switchLanguage.run(new SwitchLanguageDTO('en'));
  const event = module.events.last();
  assert.ok(event instanceof LanguageChangedEvent);
  assert.equal(event.code, 'en');
  assert.equal(event.dir, 'ltr');
  assert.ok(event.occurred_at);
});

test('неизвестный язык не меняет ничего', () => {
  const module = build();
  module.switchLanguage.run(new SwitchLanguageDTO('нет'));
  assert.equal(module.languages.getCurrent().code, 'ru');
  assert.equal(module.events.published.length, 0);
});

test('перевод идёт по цепочке: выбранный, затем запасной', () => {
  const module = build();
  assert.equal(module.translator.translate('save'), 'Скачать');
  assert.equal(module.translator.translate('done'), 'Done', 'запасной язык не подхватился');
  module.switchLanguage.run(new SwitchLanguageDTO('en'));
  assert.equal(module.translator.translate('save'), 'Download');
});

test('словарь из файла подключается, выбирается и запоминается', async () => {
  const source = JSON.stringify({ code: 'es', name: 'Español', strings: { save: 'Descargar' } });
  const module = build({ reader: FakeTextFileReader.withText('es.json', source) });

  const result = await module.importLanguage.run();
  assert.equal(result.code, 'es');
  assert.equal(result.is_stored, true);
  assert.equal(module.translator.translate('save'), 'Descargar');
  assert.equal(module.languages.listLanguages().length, 3);
  assert.ok(module.events.last() instanceof LanguageChangedEvent);

  /* и переживает пересборку */
  const second = build({ saved: { 'custom-langs': module.storage.get('custom-langs'), lang: 'es' } });
  assert.equal(second.translator.translate('save'), 'Descargar');
});

test('неполный перевод не ломает интерфейс', async () => {
  const source = JSON.stringify({ code: 'es', name: 'Español', strings: { save: 'Descargar' } });
  const module = build({ reader: FakeTextFileReader.withText('es.json', source) });
  await module.importLanguage.run();
  assert.equal(module.translator.translate('done'), 'Done', 'непереведённое должно падать на запасной язык');
});

test('хранилище отказало: язык работает, но о потере сообщают', async () => {
  const source = JSON.stringify({ code: 'es', name: 'Español', strings: { save: 'Descargar' } });
  const module = build({ reader: FakeTextFileReader.withText('es.json', source), writable: false });

  const result = await module.importLanguage.run();
  assert.equal(result.is_stored, false, 'о неудачной записи нужно сообщить');
  assert.equal(module.languages.getCurrent().code, 'es', 'в текущей сессии язык должен работать');
  assert.equal(module.translator.translate('save'), 'Descargar');
});

test('отказ от выбора файла ничего не меняет', async () => {
  const module = build();
  assert.equal(await module.importLanguage.run(), null);
  assert.equal(module.events.published.length, 0);
});

test('шаблон словаря отдаётся файлом с кодом языка', () => {
  const module = build();
  assert.equal(module.exportTemplate.run(), 'ru.json');
  assert.equal(module.writer.last().name, 'ru.json');
  assert.ok(module.writer.last().blob.size > 0);
});

test('смена темы переставляет ссылку и публикует событие', () => {
  const module = build();
  module.switchTheme.run(new SwitchThemeDTO('light'));
  assert.equal(module.sheets_nodes.link.href, 'themes/light.css');
  assert.equal(module.sheets_nodes.style.textContent, '');
  assert.ok(module.events.last() instanceof ThemeChangedEvent);
  assert.equal(module.events.last().theme_id, 'light');
});

test('тема из файла ложится поверх базовой, а не заменяет её', async () => {
  const module = build({ reader: FakeTextFileReader.withText('sand.css', ':root{ --acc:#2f7fbf; }') });
  module.switchTheme.run(new SwitchThemeDTO('light'));

  const result = await module.importTheme.run(PreferencesDictionary.CUSTOM_THEME_NAME_KEY);
  assert.equal(result.id, 'custom');
  assert.equal(module.sheets_nodes.link.href, 'themes/light.css', 'базовая тема должна остаться');
  assert.ok(module.sheets_nodes.style.textContent.includes('--acc'));
  assert.equal(module.themes.getBase().id, 'light');
});

test('своя тема переживает перезапуск вместе с базовой', async () => {
  const module = build({ reader: FakeTextFileReader.withText('sand.css', ':root{ --acc:#2f7fbf; }') });
  module.switchTheme.run(new SwitchThemeDTO('light'));
  await module.importTheme.run(PreferencesDictionary.CUSTOM_THEME_NAME_KEY);

  const second = build({
    saved: {
      'custom-theme': module.storage.get('custom-theme'),
      'theme-base': module.storage.get('theme-base'),
      theme: module.storage.get('theme')
    }
  });
  assert.equal(second.themes.getCurrent().id, 'custom');
  assert.equal(second.themes.getBase().id, 'light');
});

test('сброс убирает всё принесённое и запомненное', () => {
  const module = build({ reader: FakeTextFileReader.withText('x.css', ':root{}') });
  module.switchLanguage.run(new SwitchLanguageDTO('en'));
  module.switchTheme.run(new SwitchThemeDTO('light'));
  module.storage.set('ui', { что: 'угодно' });

  module.reset.run();
  assert.deepEqual(module.storage.keys(), []);
});
