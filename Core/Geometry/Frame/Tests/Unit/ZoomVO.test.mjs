import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';

const { ZoomVO, GeometryDictionary, InvalidZoomException } = app;

test('единица — картинка заполняет холст', () => {
  assert.equal(ZoomVO.fill().getValue(), GeometryDictionary.FILL_ZOOM);
  assert.ok(ZoomVO.fill().isFill());
  assert.equal(ZoomVO.fill().getPercent(), 100);
});

test('за границами — исключение', () => {
  assert.throws(() => new ZoomVO(0), InvalidZoomException);
  assert.throws(() => new ZoomVO(GeometryDictionary.MAX_ZOOM + 1), InvalidZoomException);
});

test('clamped подтягивает к границам', () => {
  assert.equal(ZoomVO.clamped(0).getValue(), GeometryDictionary.MIN_ZOOM);
  assert.equal(ZoomVO.clamped(99).getValue(), GeometryDictionary.MAX_ZOOM);
});

test('scaledBy не выходит за границы и не меняет исходное', () => {
  const zoom = ZoomVO.fill();
  assert.equal(zoom.scaledBy(2).getValue(), 2);
  assert.equal(zoom.scaledBy(1e6).getValue(), GeometryDictionary.MAX_ZOOM);
  assert.equal(zoom.getValue(), 1);
});

test('значение заморожено и сравнивается по величине', () => {
  assert.ok(Object.isFrozen(ZoomVO.fill()));
  assert.ok(new ZoomVO(1.5).equals(new ZoomVO(1.5)));
});
