/* Контрактные тесты публичной поверхности модуля «Кадр».
   Ими пользуется «Экспорт» — и для настоящего действия, и для своих заглушек. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';

const { RenderFrameDTO } = app;

/**
 * @param {string} name
 * @param {() => object} create реализация GetFrameGeometryInterface
 */
export function runGetFrameGeometryContract(name, create) {
  test(`${name}: контракт «дай геометрию кадра»`, async t => {
    await t.test('только примитивы, ничего живого наружу', () => {
      const geometry = create().run();
      Object.values(geometry).forEach(value => {
        assert.ok(['number', 'string', 'boolean'].includes(typeof value), `${typeof value} наружу`);
      });
    });

    await t.test('состав полей фиксирован', () => {
      assert.deepEqual(Object.keys(create().run()).sort(), [
        'has_image', 'image_height', 'image_name', 'image_width', 'offset_x', 'offset_y', 'zoom'
      ]);
    });

    await t.test('ответ заморожен', () => {
      assert.ok(Object.isFrozen(create().run()));
    });
  });
}

/**
 * @param {string} name
 * @param {() => object} create реализация RenderFrameInterface
 */
export function runRenderFrameContract(name, create) {
  test(`${name}: контракт «нарисуй кадр»`, async t => {
    await t.test('рисует в переданный контекст и ничего не возвращает', () => {
      const calls = [];
      const context = { calls, fillRect: () => calls.push('fillRect'), clearRect: () => calls.push('clearRect'),
                        drawImage: () => calls.push('drawImage'), beginPath: () => {}, moveTo: () => {},
                        lineTo: () => {}, stroke: () => {} };
      assert.equal(create().run(new RenderFrameDTO(context, 100, 100, '#000000')), undefined);
    });

    await t.test('размер цели любой', () => {
      const context = { fillRect: () => {}, clearRect: () => {}, drawImage: () => {}, beginPath: () => {},
                        moveTo: () => {}, lineTo: () => {}, stroke: () => {} };
      assert.doesNotThrow(() => create().run(new RenderFrameDTO(context, 7, 3, null)));
    });
  });
}
