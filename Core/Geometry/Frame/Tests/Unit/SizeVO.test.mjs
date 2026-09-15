/* Значение размера: неверного размера не существует. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app, plain } from '#app';

const { SizeVO, GeometryDictionary, InvalidSizeException } = app;

test('хранит стороны и пропорцию', () => {
  const size = new SizeVO(1080, 1920);
  assert.equal(size.getWidth(), 1080);
  assert.equal(size.getHeight(), 1920);
  assert.equal(size.getRatio(), 1080 / 1920);
  assert.equal(size.getLongSide(), 1920);
  assert.equal(size.isLandscape(), false);
  assert.equal(size.toString(), '1080×1920');
});

test('дробные стороны округляются', () => {
  assert.equal(new SizeVO(1080.4, 1919.6).toString(), '1080×1920');
});

test('за границами — исключение с контекстом', () => {
  assert.throws(() => new SizeVO(0, 100), InvalidSizeException);
  assert.throws(() => new SizeVO(100, GeometryDictionary.MAX_SIDE + 1), InvalidSizeException);
  assert.throws(() => new SizeVO(NaN, 100), InvalidSizeException);
  try {
    new SizeVO(1, 2);
  } catch (error) {
    assert.deepEqual(plain(error.getDetails()), { width: 1, height: 2 });
    assert.equal(error.name, 'InvalidSizeException');
  }
});

test('clamped подтягивает к границам вместо падения', () => {
  const min = GeometryDictionary.MIN_SIDE;
  assert.equal(SizeVO.clamped(1, 1).getWidth(), min);
  assert.equal(SizeVO.clamped(1e9, 1e9).getWidth(), GeometryDictionary.MAX_SIDE);
  assert.equal(SizeVO.clamped(NaN, NaN).getWidth(), min);
});

test('swap возвращает новое значение, старое не меняется', () => {
  const portrait = new SizeVO(1080, 1920);
  const landscape = portrait.swap();
  assert.equal(landscape.toString(), '1920×1080');
  assert.equal(portrait.toString(), '1080×1920');
  assert.equal(landscape.isLandscape(), true);
});

test('равенство по значению', () => {
  assert.ok(new SizeVO(100, 200).equals(new SizeVO(100, 200)));
  assert.ok(!new SizeVO(100, 200).equals(new SizeVO(200, 100)));
});

test('значение заморожено', () => {
  assert.ok(Object.isFrozen(new SizeVO(100, 200)));
});
