/* Математика кадрирования. Чистая функция от значений — самый ценный тест
   в проекте: именно здесь ошибка портит и превью, и файл. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';

const { FrameGeometryService, SizeVO, ZoomVO, OffsetVO, DrawRectDTO } = app;

const geometry = new FrameGeometryService();
const near = (actual, expected, epsilon = 0.001) =>
  assert.ok(Math.abs(actual - expected) < epsilon, `${actual} ≠ ${expected}`);

test('coverScale тянет картинку до полного покрытия холста', () => {
  /* холст 1000×1000, картинка 2000×1000: по высоте не хватает вдвое */
  near(geometry.coverScale(new SizeVO(1000, 1000), new SizeVO(2000, 1000)), 1);
  near(geometry.coverScale(new SizeVO(1000, 1000), new SizeVO(500, 500)), 2);
  near(geometry.coverScale(new SizeVO(1080, 1920), new SizeVO(2400, 1600)), 1.2);
});

test('containZoom показывает картинку целиком', () => {
  /* широкая картинка в квадрате: по ширине она вдвое шире — уменьшаем вдвое */
  near(geometry.containZoom(new SizeVO(1000, 1000), new SizeVO(2000, 1000)).getValue(), 0.5);
  near(geometry.containZoom(new SizeVO(1000, 1000), new SizeVO(1000, 2000)).getValue(), 0.5);
  /* маленькая картинка растягивается до холста */
  near(geometry.containZoom(new SizeVO(1000, 1000), new SizeVO(500, 500)).getValue(), 2);
});

test('масштаб абсолютный: смена холста не меняет размер картинки', () => {
  const image = new SizeVO(2400, 1600);
  const zoom = new ZoomVO(0.5);
  const square = geometry.drawRect(new SizeVO(3000, 3000), image, zoom, OffsetVO.centered());
  const story = geometry.drawRect(new SizeVO(1080, 1920), image, zoom, OffsetVO.centered());
  near(square.width, 1200);
  near(story.width, 1200);
  near(story.height, square.height);
});

test('при заполнении картинка накрывает холст без щелей', () => {
  const canvas = new SizeVO(1080, 1920);
  const image = new SizeVO(2400, 1600);
  const rect = geometry.drawRect(canvas, image, geometry.coverZoom(canvas, image), OffsetVO.centered());
  assert.ok(rect.width >= canvas.getWidth() - 0.001, 'по ширине есть щель');
  assert.ok(rect.height >= canvas.getHeight() - 0.001, 'по высоте есть щель');
  assert.ok(rect.x <= 0.001 && rect.y <= 0.001, 'картинка не покрывает начало координат');
  near(rect.x + rect.width, canvas.getWidth() - rect.x, 0.01);
});

test('при вписывании картинка целиком внутри холста', () => {
  const canvas = new SizeVO(1000, 1000);
  const image = new SizeVO(2000, 1000);
  const rect = geometry.drawRect(canvas, image, geometry.containZoom(canvas, image), OffsetVO.centered());
  assert.ok(rect.x >= -0.001 && rect.y >= -0.001);
  assert.ok(rect.x + rect.width <= canvas.getWidth() + 0.001);
  assert.ok(rect.y + rect.height <= canvas.getHeight() + 0.001);
  near(rect.width, 1000);
  near(rect.height, 500);
});

test('смещение читается как проценты: 0 — левый край, 1 — правый', () => {
  const canvas = new SizeVO(1000, 1000);
  const image = new SizeVO(2000, 1000);
  const left = geometry.drawRect(canvas, image, ZoomVO.actual(), new OffsetVO(0, 0.5));
  const right = geometry.drawRect(canvas, image, ZoomVO.actual(), new OffsetVO(1, 0.5));
  near(left.x, 0);
  near(right.x + right.width, canvas.getWidth());
});

test('перетаскивание вправо двигает картинку вправо', () => {
  const canvas = new SizeVO(1000, 1000);
  const image = new SizeVO(2000, 1000);
  const start = OffsetVO.centered();
  const moved = geometry.offsetAfterDrag(canvas, image, ZoomVO.actual(), start, 0.1, 0);
  const before = geometry.drawRect(canvas, image, ZoomVO.actual(), start);
  const after = geometry.drawRect(canvas, image, ZoomVO.actual(), moved);
  assert.ok(after.x > before.x, 'картинка поехала не в ту сторону');
  near(after.x - before.x, 100);
});

test('перетаскивание не выводит картинку за край', () => {
  const canvas = new SizeVO(1000, 1000);
  const image = new SizeVO(2000, 1000);
  const far = geometry.offsetAfterDrag(canvas, image, ZoomVO.actual(), OffsetVO.centered(), 10, 10);
  assert.ok(far.getX() >= 0 && far.getX() <= 1);
  const rect = geometry.drawRect(canvas, image, ZoomVO.actual(), far);
  assert.ok(rect.x <= 0.001, 'слева появилась щель');
});

test('приближение удерживает точку под курсором', () => {
  const canvas = new SizeVO(1000, 1000);
  const image = new SizeVO(2000, 1000);
  const from = geometry.coverZoom(canvas, image);
  const to = new ZoomVO(2);
  const anchor = new OffsetVO(0.25, 0.5);
  const start = OffsetVO.centered();

  /* какая точка картинки была под курсором до приближения */
  const before = geometry.drawRect(canvas, image, from, start);
  const point_x = anchor.getX() * canvas.getWidth();
  const held = (point_x - before.x) / before.width;

  const moved = geometry.offsetAfterZoom(canvas, image, start, from, to, anchor);
  const after = geometry.drawRect(canvas, image, to, moved);
  near((point_x - after.x) / after.width, held, 0.002);
});

test('drawnSize — размер картинки на холсте при текущем масштабе', () => {
  const canvas = new SizeVO(1000, 1000);
  const image = new SizeVO(2000, 1000);
  const drawn = geometry.drawnSize(canvas, image, new ZoomVO(2));
  near(drawn.getWidth(), 4000);
  near(drawn.getHeight(), 2000);
});

test('fittedSize даёт холст пропорций картинки по меньшей стороне', () => {
  /* исходник 3:2 в вертикальный холст: ширина остаётся, высота уменьшается */
  const fitted = geometry.fittedSize(new SizeVO(1080, 1920), new SizeVO(2400, 1600));
  assert.equal(fitted.toString(), '1080×720');
  /* и наоборот: вертикальный исходник в горизонтальный холст */
  const other = geometry.fittedSize(new SizeVO(1920, 1080), new SizeVO(1600, 2400));
  assert.equal(other.toString(), '720×1080');
});

test('matchedSize сохраняет длинную сторону холста', () => {
  const matched = geometry.matchedSize(new SizeVO(3000, 3000), new SizeVO(2400, 1600));
  assert.equal(matched.getLongSide(), 3000);
  near(matched.getRatio(), 2400 / 1600, 0.01);
});

test('upscaleFactor предупреждает о растягивании вверх', () => {
  const canvas = new SizeVO(3000, 3000);
  /* маленькая картинка на большом холсте: тянем вдвое */
  const small = new SizeVO(1500, 1500);
  const large = new SizeVO(6000, 6000);
  near(geometry.upscaleFactor(canvas, small, geometry.coverZoom(canvas, small)), 2);
  /* большая картинка: запас есть */
  assert.ok(geometry.upscaleFactor(canvas, large, geometry.coverZoom(canvas, large)) < 1);
});

test('visibleSourceWidth считает пиксели оригинала в кадре', () => {
  const canvas = new SizeVO(1000, 1000);
  near(geometry.visibleSourceWidth(canvas, new SizeVO(2000, 2000), new ZoomVO(0.5)), 2000);
  near(geometry.visibleSourceWidth(canvas, new SizeVO(2000, 2000), new ZoomVO(1)), 1000);
});

test('visibleRect — пересечение картинки и холста', () => {
  const canvas = new SizeVO(1000, 1000);
  /* широкая картинка вписана: сверху и снизу поля по 250 */
  const fitted = geometry.visibleRect(canvas, new SizeVO(2000, 1000), new ZoomVO(0.5), OffsetVO.centered());
  near(fitted.x, 0); near(fitted.y, 250); near(fitted.width, 1000); near(fitted.height, 500);
  /* заполнение: видно весь холст */
  const filled = geometry.visibleRect(canvas, new SizeVO(2000, 1000), new ZoomVO(1), new OffsetVO(0, 0));
  near(filled.x, 0); near(filled.y, 0); near(filled.width, 1000); near(filled.height, 1000);
});

test('после обрезки на месте остаётся та же часть картинки', () => {
  const canvas = new SizeVO(1000, 1000);
  const image = new SizeVO(2000, 1000);
  const zoom = new ZoomVO(1);
  const offset = new OffsetVO(0.3, 0.5);
  const area = new DrawRectDTO(200, 100, 400, 300);

  const before = geometry.drawRect(canvas, image, zoom, offset);
  const moved = geometry.offsetAfterCrop(canvas, image, zoom, offset, area);
  const after = geometry.drawRect(new SizeVO(400, 300), image, zoom, moved);
  near(after.x, before.x - area.x, 0.01);
  near(after.y, before.y - area.y, 0.01);
  near(after.width, before.width);
});

test('входные значения не меняются', () => {
  const canvas = new SizeVO(1000, 1000);
  const image = new SizeVO(2000, 1000);
  const zoom = ZoomVO.actual();
  const offset = OffsetVO.centered();
  geometry.drawRect(canvas, image, zoom, offset);
  geometry.offsetAfterDrag(canvas, image, zoom, offset, 0.5, 0.5);
  geometry.offsetAfterZoom(canvas, image, offset, zoom, new ZoomVO(2), OffsetVO.centered());
  assert.equal(canvas.toString(), '1000×1000');
  assert.equal(zoom.getValue(), 1);
  assert.ok(offset.isCentered());
});
