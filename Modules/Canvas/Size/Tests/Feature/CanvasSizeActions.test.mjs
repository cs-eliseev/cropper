/* Действия модуля на настоящем репозитории с хранилищем в памяти
   и шиной-шпионом. Ни DOM, ни браузера. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';
import { SpyEventBus } from '../../../../../kernel/Tests/Doubles/SpyEventBus.mjs';
import { InMemoryKeyValueStorage } from '../../../../../Core/Storage/KeyValue/Tests/Doubles/InMemoryKeyValueStorage.mjs';
import { runGetCanvasSizeContract, runResizeCanvasContract } from '../Contracts/CanvasSizeContractTest.mjs';

const {
  SizeVO, CanvasRepository, StoreCanvasSizeInteractor, CanvasPresetDTO,
  GetCanvasSizeAction, ResizeCanvasAction, ApplyCanvasPresetAction, SwapCanvasSidesAction,
  ResizeCanvasDTO, ApplyCanvasPresetDTO, CanvasResizedEvent
} = app;

const PRESETS = [
  new CanvasPresetDTO('cover', 3000, 3000, 'presetCover', 'presetCoverMeta'),
  new CanvasPresetDTO('story', 1080, 1920, 'presetStory', 'presetStoryMeta')
];

function build(saved = null) {
  const storage = new InMemoryKeyValueStorage();
  if (saved) storage.set('canvas', saved);
  const repository = new CanvasRepository(storage, new SizeVO(3000, 3000), 'cover');
  const events = new SpyEventBus();
  const store = new StoreCanvasSizeInteractor(repository);
  return {
    storage, repository, events,
    read: new GetCanvasSizeAction(repository),
    resize: new ResizeCanvasAction(store, events),
    applyPreset: new ApplyCanvasPresetAction(store, events, PRESETS),
    swap: new SwapCanvasSidesAction(repository, store, events)
  };
}

/* та же проверка, что пройдут заглушки у «Кадра» и «Экспорта» */
runGetCanvasSizeContract('GetCanvasSizeAction', () => build().read);
runResizeCanvasContract('ResizeCanvasAction', () => {
  const module = build();
  return { resize: module.resize, read: module.read };
});

test('свой размер публикует событие и запоминается', () => {
  const module = build();
  const result = module.resize.run(new ResizeCanvasDTO(1200, 800));

  assert.equal(result.width, 1200);
  assert.equal(module.events.ofType(CanvasResizedEvent).length, 1);

  const event = module.events.last();
  assert.equal(event.width, 1200);
  assert.equal(event.height, 800);
  assert.equal(event.preset_id, null);
  assert.ok(event.occurred_at, 'событие без времени факта');
  assert.ok(Object.isFrozen(event), 'событие изменяемо');

  assert.deepEqual(module.storage.keys(), ['canvas']);
  assert.equal(module.storage.get('canvas').width, 1200);
});

test('шаблон ставит размер и помечает выбор', () => {
  const module = build();
  const result = module.applyPreset.run(new ApplyCanvasPresetDTO('story'));
  assert.equal(result.width, 1080);
  assert.equal(result.preset_id, 'story');
  assert.equal(module.events.last().preset_id, 'story');
});

test('неизвестный шаблон ничего не меняет и не шумит в шину', () => {
  const module = build();
  assert.equal(module.applyPreset.run(new ApplyCanvasPresetDTO('нет такого')), null);
  assert.equal(module.events.published.length, 0);
  assert.equal(module.read.run().width, 3000);
});

test('обмен сторон переворачивает холст и снимает шаблон', () => {
  const module = build();
  module.applyPreset.run(new ApplyCanvasPresetDTO('story'));
  const result = module.swap.run();
  assert.equal(result.width, 1920);
  assert.equal(result.height, 1080);
  assert.equal(result.preset_id, null);
});

test('размер за границами подтягивается, а не роняет операцию', () => {
  const module = build();
  const result = module.resize.run(new ResizeCanvasDTO(-10, 1e9));
  assert.ok(result.width >= 16);
  assert.ok(result.height <= 30000);
});

test('сохранённый размер переживает пересборку модуля', () => {
  const first = build();
  first.resize.run(new ResizeCanvasDTO(1234, 567));
  const saved = first.storage.get('canvas');

  const second = build(saved);
  assert.equal(second.read.run().width, 1234);
  assert.equal(second.read.run().height, 567);
});

test('ответ действия — DTO с примитивами, наружу ничего живого', () => {
  const result = build().resize.run(new ResizeCanvasDTO(1200, 800));
  assert.ok(Object.isFrozen(result));
  assert.deepEqual(Object.keys(result).sort(), ['height', 'preset_id', 'width']);
});
