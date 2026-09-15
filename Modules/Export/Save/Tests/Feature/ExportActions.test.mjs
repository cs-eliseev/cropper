/* Действия экспорта. Чужие модули — заглушками, которые проходят их
   контрактные тесты; браузер — портами. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';
import { SpyEventBus } from '../../../../../kernel/Tests/Doubles/SpyEventBus.mjs';
import { InMemoryKeyValueStorage } from '../../../../../Core/Storage/KeyValue/Tests/Doubles/InMemoryKeyValueStorage.mjs';
import { FakeCanvasSize } from '../../../../Canvas/Size/Tests/Doubles/FakeCanvasSize.mjs';
import { FakeRenderFrame, FakeFrameGeometry } from '../../../../Image/Frame/Tests/Doubles/FakeFrame.mjs';
import { runRenderFrameContract, runGetFrameGeometryContract } from '../../../../Image/Frame/Tests/Contracts/FrameContractTest.mjs';
import { FakeCanvasFactory, FakeFileWriter } from '../Doubles/ExportDoubles.mjs';

const {
  ExportSettingsRepository, ExportFormatDTO, FileNameService,
  ExportImageAction, ChangeExportFormatAction, ChangeExportQualityAction,
  RenameExportFileAction, SuggestExportFileNameAction,
  ChangeExportFormatDTO, ChangeExportQualityDTO, RenameExportFileDTO,
  ExportSettingsChangedEvent, ImageExportedEvent
} = app;

const FORMATS = [
  new ExportFormatDTO('JPEG', 'image/jpeg', 'jpg', false, true),
  new ExportFormatDTO('PNG', 'image/png', 'png', true, false),
  new ExportFormatDTO('WEBP', 'image/webp', 'webp', true, true)
];

function build({ blob = { size: 4096 }, saved = null } = {}) {
  const storage = new InMemoryKeyValueStorage();
  if (saved) storage.set('export', saved);
  const settings = new ExportSettingsRepository(storage, FORMATS, 0.94);
  const canvas = new FakeCanvasSize(1080, 1920);
  const events = new SpyEventBus();
  const names = new FileNameService('cover-{w}x{h}.{ext}');
  const targets = new FakeCanvasFactory(blob);
  const writer = new FakeFileWriter();
  const render = new FakeRenderFrame();

  const module = {
    storage, settings, canvas, events, targets, writer, render,
    suggest: new SuggestExportFileNameAction(settings, canvas, names, events),
    changeFormat: new ChangeExportFormatAction(settings, names, events),
    changeQuality: new ChangeExportQualityAction(settings, events),
    rename: new RenameExportFileAction(settings, events),
    export: new ExportImageAction(settings, canvas, targets, render, writer, events, '#000000')
  };
  module.suggest.run();
  events.clear();
  return module;
}

/* заглушки чужого модуля обязаны вести себя как настоящий */
runRenderFrameContract('FakeRenderFrame (заглушка «Экспорта»)', () => new FakeRenderFrame());
runGetFrameGeometryContract('FakeFrameGeometry (заглушка «Экспорта»)', () => new FakeFrameGeometry());

test('имя файла собирается из размера холста', () => {
  const module = build();
  assert.equal(module.settings.getSettings().file_name, 'cover-1080x1920.jpg');
});

test('смена формата меняет расширение и публикует событие', () => {
  const module = build();
  const result = module.changeFormat.run(new ChangeExportFormatDTO('WEBP'));
  assert.equal(result.format_id, 'WEBP');
  assert.equal(result.file_name, 'cover-1080x1920.webp');
  assert.ok(module.events.last() instanceof ExportSettingsChangedEvent);
});

test('неизвестный формат игнорируется', () => {
  const module = build();
  assert.equal(module.changeFormat.run(new ChangeExportFormatDTO('TIFF')).format_id, 'JPEG');
});

test('качество зажимается в допустимые пределы', () => {
  const module = build();
  assert.equal(module.changeQuality.run(new ChangeExportQualityDTO(5)).quality, 1);
  assert.equal(module.changeQuality.run(new ChangeExportQualityDTO(-1)).quality, 0.1);
});

test('правка имени человеком отключает пересборку', () => {
  const module = build();
  module.rename.run(new RenameExportFileDTO('моё имя.jpg', true));
  module.canvas.resizer.run({ width: 500, height: 500 });
  module.suggest.run();
  assert.equal(module.settings.getSettings().file_name, 'моё имя.jpg');
});

test('без правки имя следует за размером холста', () => {
  const module = build();
  module.canvas.resizer.run({ width: 500, height: 500 });
  module.suggest.run();
  assert.equal(module.settings.getSettings().file_name, 'cover-500x500.jpg');
});

test('экспорт рисует чужой картинкой, отдаёт файл и сообщает о факте', async () => {
  const module = build();
  const event = await module.export.run();

  assert.equal(module.targets.last().width, 1080, 'холст создан не того размера');
  assert.deepEqual(module.render.last(), {
    width: 1080, height: 1920, matte: '#000000', context: module.targets.last().context
  });
  assert.deepEqual(module.targets.last().encodings, [{ mime: 'image/jpeg', quality: 0.94 }]);
  assert.equal(module.writer.last().name, 'cover-1080x1920.jpg');

  assert.ok(event instanceof ImageExportedEvent);
  assert.equal(event.bytes, 4096);
  assert.equal(event.width, 1080);
  assert.ok(Object.isFrozen(event));
});

test('формат с прозрачностью экспортируется без заливки полей', async () => {
  const module = build();
  module.changeFormat.run(new ChangeExportFormatDTO('PNG'));
  await module.export.run();
  assert.equal(module.render.last().matte, null);
  assert.equal(module.targets.last().encodings[0].mime, 'image/png');
});

test('браузер не отдал файл — события об экспорте нет', async () => {
  const module = build({ blob: null });
  assert.equal(await module.export.run(), null);
  assert.equal(module.writer.saved.length, 0);
  assert.equal(module.events.ofType(ImageExportedEvent).length, 0);
});

test('формат и качество переживают пересборку модуля', () => {
  const first = build();
  first.changeFormat.run(new ChangeExportFormatDTO('WEBP'));
  first.changeQuality.run(new ChangeExportQualityDTO(0.5));

  const second = build({ saved: first.storage.get('export') });
  assert.equal(second.settings.getFormat().id, 'WEBP');
  assert.equal(second.settings.getSettings().quality, 0.5);
});
