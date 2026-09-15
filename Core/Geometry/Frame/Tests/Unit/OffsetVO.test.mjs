import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';

const { OffsetVO, InvalidOffsetException } = app;

test('центр — половина по обеим осям', () => {
  const centered = OffsetVO.centered();
  assert.equal(centered.getX(), 0.5);
  assert.equal(centered.getY(), 0.5);
  assert.ok(centered.isCentered());
});

test('за пределами 0..1 — исключение', () => {
  assert.throws(() => new OffsetVO(-0.1, 0.5), InvalidOffsetException);
  assert.throws(() => new OffsetVO(0.5, 1.1), InvalidOffsetException);
});

test('clamped прижимает к краю', () => {
  assert.equal(OffsetVO.clamped(-5, 5).getX(), 0);
  assert.equal(OffsetVO.clamped(-5, 5).getY(), 1);
  assert.equal(OffsetVO.clamped(NaN, NaN).getX(), 0.5);
});

test('значение заморожено', () => {
  assert.ok(Object.isFrozen(OffsetVO.centered()));
});
