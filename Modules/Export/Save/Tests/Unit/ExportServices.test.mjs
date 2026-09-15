/* Чистая логика экспорта: имя файла и оценка запаса качества. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';

const { FileNameService, QualityEstimateService, FrameGeometryService, SizeVO, ZoomVO, ExportFormatDTO } = app;

const JPEG = new ExportFormatDTO('JPEG', 'image/jpeg', 'jpg', false, true);
const PNG = new ExportFormatDTO('PNG', 'image/png', 'png', true, false);

test('имя собирается по шаблону', () => {
  const names = new FileNameService('cover-{w}x{h}.{ext}');
  assert.equal(names.build(new SizeVO(1080, 1920), JPEG), 'cover-1080x1920.jpg');
  assert.equal(names.build(new SizeVO(1080, 1920), PNG), 'cover-1080x1920.png');
});

test('шаблон без подстановок остаётся как есть', () => {
  assert.equal(new FileNameService('готово.jpg').build(new SizeVO(100, 100), JPEG), 'готово.jpg');
});

test('расширение меняется, имя сохраняется', () => {
  const names = new FileNameService('cover-{w}x{h}.{ext}');
  assert.equal(names.withExtension('моя обложка.jpg', PNG), 'моя обложка.png');
  assert.equal(names.withExtension('без расширения', PNG), 'без расширения');
  assert.equal(names.withExtension('точка.в.имени.jpg', PNG), 'точка.в.имени.png');
});

test('запас есть, когда оригинал крупнее холста', () => {
  const quality = new QualityEstimateService(new FrameGeometryService());
  const estimate = quality.estimate(new SizeVO(1000, 1000), new SizeVO(4000, 4000), ZoomVO.fill());
  assert.equal(estimate.is_enough, true);
  assert.equal(estimate.target_px, 1000);
  assert.ok(estimate.upscale < 1);
  assert.ok(Object.isFrozen(estimate));
});

test('картинку тянут вверх — предупреждаем', () => {
  const quality = new QualityEstimateService(new FrameGeometryService());
  const estimate = quality.estimate(new SizeVO(3000, 3000), new SizeVO(1500, 1500), ZoomVO.fill());
  assert.equal(estimate.is_enough, false);
  assert.equal(estimate.upscale, 2);
  assert.equal(estimate.source_px, 1500);
});

test('приближение съедает запас', () => {
  const quality = new QualityEstimateService(new FrameGeometryService());
  const wide = quality.estimate(new SizeVO(1000, 1000), new SizeVO(2000, 2000), ZoomVO.fill());
  const close = quality.estimate(new SizeVO(1000, 1000), new SizeVO(2000, 2000), new ZoomVO(2));
  assert.equal(wide.is_enough, true);
  assert.equal(close.is_enough, true);
  assert.ok(close.source_px < wide.source_px, 'в кадр должно попадать меньше оригинала');
});
