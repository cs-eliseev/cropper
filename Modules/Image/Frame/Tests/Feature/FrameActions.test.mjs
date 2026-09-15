/* Действия кадра: настоящий репозиторий, чужой модуль — заглушкой,
   которая проходит его же контрактные тесты. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';
import { SpyEventBus } from '../../../../../kernel/Tests/Doubles/SpyEventBus.mjs';
import { InMemoryKeyValueStorage } from '../../../../../Core/Storage/KeyValue/Tests/Doubles/InMemoryKeyValueStorage.mjs';
import {
  runGetCanvasSizeContract, runResizeCanvasContract
} from '../../../../Canvas/Size/Tests/Contracts/CanvasSizeContractTest.mjs';
import { runGetFrameGeometryContract, runRenderFrameContract } from '../Contracts/FrameContractTest.mjs';
import { FakeCanvasSize } from '../../../../Canvas/Size/Tests/Doubles/FakeCanvasSize.mjs';
import {
  FakeImageDecoder, FakeFileReader, FakePainter, FakeThemeTokens, sourceImage, pickedFile
} from '../Doubles/FrameDoubles.mjs';

const {
  FrameRepository, FrameGeometryService, ZoomVO, OffsetVO,
  GetFrameGeometryAction, RenderFrameAction, LoadImageAction,
  ZoomImageAction, MoveImageAction, FitImageAction, FillImageAction, CenterImageAction,
  TrimCanvasToVisibleAction, FitCanvasToImageAction, MatchCanvasToImageAction,
  ToggleFramingGridAction,
  LoadImageDTO, ZoomImageDTO, MoveImageDTO, RenderFrameDTO,
  ImageLoadedEvent, FrameChangedEvent, FramingGridToggledEvent, ImageNotReadableException
} = app;

function build({ withImage = true, canvas = new FakeCanvasSize(1000, 1000), decoder } = {}) {
  const storage = new InMemoryKeyValueStorage();
  const frame = new FrameRepository(storage, true);
  if (withImage) frame.updateImage(sourceImage(2000, 1000));
  const events = new SpyEventBus();
  const geometry = new FrameGeometryService();
  const painter = new FakePainter();
  const tokens = new FakeThemeTokens();
  const reader = new FakeFileReader();
  const image_decoder = decoder || new FakeImageDecoder();

  return {
    storage, frame, events, canvas, painter, tokens, reader, decoder: image_decoder,
    read: new GetFrameGeometryAction(frame),
    render: new RenderFrameAction(frame, canvas, geometry, painter, tokens),
    load: new LoadImageAction(reader, image_decoder, frame, events),
    zoom: new ZoomImageAction(frame, canvas, geometry, events),
    move: new MoveImageAction(frame, canvas, geometry, events),
    fit: new FitImageAction(frame, canvas, geometry, events),
    fill: new FillImageAction(frame, events),
    center: new CenterImageAction(frame, events),
    trimVisible: new TrimCanvasToVisibleAction(frame, canvas, canvas.resizer, geometry, events),
    trimFit: new FitCanvasToImageAction(frame, canvas, canvas.resizer, geometry, events),
    trimMatch: new MatchCanvasToImageAction(frame, canvas, canvas.resizer, geometry, events),
    toggleGrid: new ToggleFramingGridAction(frame, events)
  };
}

const drawContext = () => ({
  fillRect: () => {}, clearRect: () => {}, drawImage: () => {},
  beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {}
});

/* заглушка чужого модуля обязана вести себя как настоящий модуль */
runGetCanvasSizeContract('FakeCanvasSize (заглушка «Кадра»)', () => new FakeCanvasSize());
runResizeCanvasContract('FakeCanvasSize (заглушка «Кадра»)', () => {
  const fake = new FakeCanvasSize();
  return { resize: fake.resizer, read: fake };
});

/* свои контракты — на настоящих действиях */
runGetFrameGeometryContract('GetFrameGeometryAction', () => build().read);
runRenderFrameContract('RenderFrameAction', () => build().render);

test('загрузка картинки публикует событие и сбрасывает кадр', async () => {
  const module = build({ withImage: false });
  const result = await module.load.run(new LoadImageDTO(null));

  assert.equal(module.reader.picks, 1, 'файл не запрошен');
  assert.equal(result.has_image, true);
  assert.equal(result.image_width, 2400);

  const event = module.events.last();
  assert.ok(event instanceof ImageLoadedEvent);
  assert.equal(event.name, 'photo.png');
  assert.ok(Object.isFrozen(event));
});

test('принесённый файл не открывает диалог', async () => {
  const module = build({ withImage: false });
  await module.load.run(new LoadImageDTO(pickedFile('dropped.png')));
  assert.equal(module.reader.picks, 0, 'диалог открылся зря');
  assert.equal(module.decoder.calls, 1);
});

test('отказ от выбора файла ничего не меняет', async () => {
  const module = build({ withImage: false });
  module.reader.picks = 0;
  const empty = new LoadImageAction(FakeFileReader.empty(), module.decoder, module.frame, module.events);
  assert.equal(await empty.run(new LoadImageDTO(null)), null);
  assert.equal(module.events.published.length, 0);
});

test('нечитаемый файл поднимает доменную ошибку', async () => {
  const module = build({ withImage: false, decoder: FakeImageDecoder.broken('битый.png') });
  await assert.rejects(() => module.load.run(new LoadImageDTO(null)), ImageNotReadableException);
  assert.equal(module.events.published.length, 0, 'событие о неудаче публиковать нельзя');
});

test('приближение меняет масштаб и публикует событие', () => {
  const module = build();
  const event = module.zoom.run(new ZoomImageDTO(2));
  assert.ok(event instanceof FrameChangedEvent);
  assert.equal(module.read.run().zoom, 2);
});

test('приближение за границами подтягивается', () => {
  const module = build();
  module.zoom.run(new ZoomImageDTO(999));
  assert.equal(module.read.run().zoom, 4);
});

test('без картинки действия кадра ничего не делают', () => {
  const module = build({ withImage: false });
  assert.equal(module.zoom.run(new ZoomImageDTO(2)), null);
  assert.equal(module.move.run(new MoveImageDTO(0.5, 0.5, 0.1, 0)), null);
  assert.equal(module.fit.run(), null);
  assert.equal(module.fill.run(), null);
  assert.equal(module.center.run(), null);
  assert.equal(module.events.published.length, 0);
});

test('перетаскивание двигает кадр от указанной точки', () => {
  const module = build();
  module.move.run(new MoveImageDTO(0.5, 0.5, 0.2, 0));
  const after = module.read.run();
  assert.notEqual(after.offset_x, 0.5);
  assert.ok(after.offset_x >= 0 && after.offset_x <= 1);
});

test('вписать, заполнить и центр приводят кадр в известное состояние', () => {
  const module = build();
  module.zoom.run(new ZoomImageDTO(3));

  module.fit.run();
  assert.ok(module.read.run().zoom < 1, 'вписывание должно уменьшать');

  module.fill.run();
  assert.equal(module.read.run().zoom, 1);

  module.move.run(new MoveImageDTO(0.5, 0.5, 0.3, 0.3));
  module.center.run();
  assert.equal(module.read.run().offset_x, 0.5);
  assert.equal(module.read.run().offset_y, 0.5);
});

test('подгонка холста идёт через контракт чужого модуля', () => {
  const module = build();
  module.trimFit.run();

  assert.equal(module.canvas.resizes.length, 1, 'чужой модуль не позвали');
  assert.deepEqual(module.canvas.resizes[0], { width: 1000, height: 500 });
  assert.equal(module.read.run().zoom, 1, 'после подгонки кадр не сброшен');
  assert.ok(module.events.last() instanceof FrameChangedEvent);
});

test('подгонка по видимой части учитывает масштаб', () => {
  const module = build();
  module.zoom.run(new ZoomImageDTO(2));
  module.trimVisible.run();
  assert.deepEqual(module.canvas.resizes[0], { width: 4000, height: 2000 });
});

test('пропорциональная подгонка сохраняет длинную сторону', () => {
  const module = build();
  module.trimMatch.run();
  const [{ width, height }] = module.canvas.resizes;
  assert.equal(Math.max(width, height), 1000);
  assert.equal(width / height, 2);
});

test('без картинки холст не трогается', () => {
  const module = build({ withImage: false });
  assert.equal(module.trimFit.run(), null);
  assert.equal(module.canvas.resizes.length, 0);
});

test('отрисовка отдаёт художнику прямоугольник из геометрии', () => {
  const module = build();
  module.render.run(new RenderFrameDTO(drawContext(), 500, 500, '#000000'));

  const call = module.painter.last();
  assert.equal(call.matte, '#000000');
  assert.equal(call.scale, 0.5, 'масштаб цели считается от ширины холста');
  assert.equal(call.rect.width, 2000);
  assert.equal(call.rect.height, 1000);
  assert.equal(module.painter.placeholders.length, 0);
});

test('без картинки рисуется штриховка цветами темы', () => {
  const module = build({ withImage: false });
  module.render.run(new RenderFrameDTO(drawContext(), 100, 100, null));
  assert.equal(module.painter.images.length, 0);
  assert.equal(module.painter.placeholders.length, 1);
  assert.equal(module.painter.placeholders[0].tokens.hatch_a, '#111111');
});

test('сетка переключается и запоминается', () => {
  const module = build();
  assert.equal(module.frame.isGridVisible(), true);
  const event = module.toggleGrid.run();
  assert.ok(event instanceof FramingGridToggledEvent);
  assert.equal(event.is_visible, false);
  assert.equal(module.storage.get('grid'), false);
});
