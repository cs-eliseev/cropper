/* Панель: раскрытие блоков, режим аккордеона, память между запусками. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app, plain } from '#app';
import { SpyEventBus } from '../../../../../kernel/Tests/Doubles/SpyEventBus.mjs';
import { InMemoryKeyValueStorage } from '../../../../../Core/Storage/KeyValue/Tests/Doubles/InMemoryKeyValueStorage.mjs';

const {
  PanelRepository, ToggleBlockAction, TogglePanelAction,
  SetAccordionModeAction, ToggleAllBlocksAction,
  ToggleBlockDTO, SetAccordionModeDTO, PanelChangedEvent
} = app;

const BLOCKS = ['size', 'frame', 'save'];

function build({ open = ['size'], saved = null } = {}) {
  const storage = new InMemoryKeyValueStorage();
  if (saved) storage.set('panel', saved);
  const panel = new PanelRepository(storage, BLOCKS, open);
  const events = new SpyEventBus();
  return {
    storage, panel, events,
    toggleBlock: new ToggleBlockAction(panel, events),
    togglePanel: new TogglePanelAction(panel, events),
    setMode: new SetAccordionModeAction(panel, events),
    toggleAll: new ToggleAllBlocksAction(panel, events)
  };
}

test('при первом запуске раскрыто то, что указано в настройках', () => {
  const module = build({ open: ['size', 'frame'] });
  assert.deepEqual(plain(module.panel.getState().open_blocks), ['size', 'frame']);
});

test('в режиме «несколько» блоки не мешают друг другу', () => {
  const module = build({ open: [] });
  module.toggleBlock.run(new ToggleBlockDTO('size'));
  module.toggleBlock.run(new ToggleBlockDTO('save'));
  assert.deepEqual(plain(module.panel.getState().open_blocks), ['size', 'save']);
});

test('в режиме «по одному» открытие закрывает остальные', () => {
  const module = build({ open: ['size', 'frame'] });
  module.setMode.run(new SetAccordionModeDTO('single'));
  assert.equal(module.panel.getState().open_blocks.length, 1, 'лишние должны закрыться сразу');

  module.toggleBlock.run(new ToggleBlockDTO('save'));
  assert.deepEqual(plain(module.panel.getState().open_blocks), ['save']);
});

test('повторное нажатие закрывает блок', () => {
  const module = build({ open: [] });
  module.toggleBlock.run(new ToggleBlockDTO('size'));
  module.toggleBlock.run(new ToggleBlockDTO('size'));
  assert.deepEqual(plain(module.panel.getState().open_blocks), []);
});

test('«свернуть всё» и «раскрыть всё»', () => {
  const module = build({ open: ['size'] });
  module.toggleAll.run();
  assert.deepEqual(plain(module.panel.getState().open_blocks), []);

  module.toggleAll.run();
  assert.deepEqual(plain(module.panel.getState().open_blocks), BLOCKS);
  assert.equal(module.panel.getState().mode, 'multi', 'раскрытие всех включает режим «несколько»');
});

test('панель сворачивается целиком', () => {
  const module = build();
  assert.equal(module.togglePanel.run().is_open, false);
  assert.equal(module.togglePanel.run().is_open, true);
});

test('каждое действие публикует состояние', () => {
  const module = build();
  module.toggleBlock.run(new ToggleBlockDTO('save'));
  const event = module.events.last();
  assert.ok(event instanceof PanelChangedEvent);
  assert.ok(Object.isFrozen(event));
  assert.ok(Object.isFrozen(event.open_blocks), 'список внутри события изменяем');
  assert.ok(event.occurred_at);
});

test('состояние переживает перезапуск', () => {
  const first = build({ open: [] });
  first.toggleBlock.run(new ToggleBlockDTO('save'));
  first.togglePanel.run();
  first.setMode.run(new SetAccordionModeDTO('single'));

  const second = build({ open: ['size'], saved: first.storage.get('panel') });
  const state = second.panel.getState();
  assert.deepEqual(plain(state.open_blocks), ['save']);
  assert.equal(state.is_open, false);
  assert.equal(state.mode, 'single');
});

test('исчезнувший из настроек блок не всплывает из хранилища', () => {
  const module = build({ saved: { open_blocks: ['size', 'удалённый'], is_open: true, mode: 'multi' } });
  assert.deepEqual(plain(module.panel.getState().open_blocks), ['size']);
});

test('состояние наружу — копия, менять его снаружи нельзя', () => {
  const module = build();
  const state = module.panel.getState();
  assert.ok(Object.isFrozen(state));
  assert.throws(() => state.open_blocks.push('save'), TypeError);
});
