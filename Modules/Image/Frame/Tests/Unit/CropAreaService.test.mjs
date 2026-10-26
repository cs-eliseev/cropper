/* Поведение рамки обрезки под рукой. Чистая логика — без заглушек. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';

const { CropAreaService, CropHandleEnum, DrawRectDTO, InvalidCropHandleException } = app;

const areas = new CropAreaService();
const bounds = new DrawRectDTO(0, 0, 1000, 500);
const from = new DrawRectDTO(100, 100, 200, 100);
const box = rect => [rect.x, rect.y, rect.width, rect.height].map(v => Math.round(v));

test('угол тянет две стороны, противоположный угол стоит', () => {
  assert.deepEqual(box(areas.dragged(from, CropHandleEnum.SE, 50, 20, bounds, false)), [100, 100, 250, 120]);
  assert.deepEqual(box(areas.dragged(from, CropHandleEnum.NW, -50, -20, bounds, false)), [50, 80, 250, 120]);
});

test('ручка на стороне тянет только её', () => {
  assert.deepEqual(box(areas.dragged(from, CropHandleEnum.E, 50, 999, bounds, false)), [100, 100, 250, 100]);
  assert.deepEqual(box(areas.dragged(from, CropHandleEnum.N, 999, -30, bounds, false)), [100, 70, 200, 130]);
});

test('край, перетянутый через противоположный, разворачивает рамку', () => {
  assert.deepEqual(box(areas.dragged(from, CropHandleEnum.E, -300, 0, bounds, false)), [0, 100, 100, 100]);
});

test('рамка не выходит за картинку', () => {
  assert.deepEqual(box(areas.dragged(from, CropHandleEnum.SE, 5000, 5000, bounds, false)), [100, 100, 900, 400]);
  assert.deepEqual(box(areas.dragged(from, CropHandleEnum.MOVE, -5000, 5000, bounds, false)), [0, 400, 200, 100]);
});

test('Shift держит пропорции рамки и не выпускает её за край', () => {
  const kept = areas.dragged(from, CropHandleEnum.SE, 200, 0, bounds, true);
  assert.deepEqual(box(kept), [100, 100, 400, 200]);
  const limited = areas.dragged(from, CropHandleEnum.SE, 5000, 0, bounds, true);
  assert.ok(limited.y + limited.height <= 500.001, 'рамка вылезла вниз');
  assert.ok(Math.abs(limited.width / limited.height - 2) < 0.001, 'пропорция потерялась');
});

test('новая рамка из точки с Shift — квадрат', () => {
  const point = new DrawRectDTO(300, 200, 0, 0);
  assert.deepEqual(box(areas.dragged(point, CropHandleEnum.SE, 120, 40, bounds, true)), [300, 200, 120, 120]);
});

test('неизвестная ручка — доменная ошибка', () => {
  assert.throws(() => areas.dragged(from, 'middle', 0, 0, bounds, false), InvalidCropHandleException);
});
