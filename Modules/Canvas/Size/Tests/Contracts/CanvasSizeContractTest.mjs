/* Контрактные тесты публичной поверхности модуля «Размер холста».
   Их проходит и настоящее действие, и заглушки, которыми пользуются
   «Кадр» и «Экспорт»: иначе тест на заглушке ничего не доказывает. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '#app';

const { SizeVO } = app;

/**
 * @param {string} name имя реализации в отчёте
 * @param {() => object} create собирает реализацию GetCanvasSizeInterface
 */
export function runGetCanvasSizeContract(name, create) {
  test(`${name}: контракт «дай размер холста»`, async t => {
    await t.test('отдаёт размер примитивами', () => {
      const size = create().run();
      assert.equal(typeof size.width, 'number');
      assert.equal(typeof size.height, 'number');
      assert.ok(size.width > 0 && size.height > 0);
      assert.ok(Number.isInteger(size.width) && Number.isInteger(size.height));
    });

    await t.test('поле шаблона — строка или null', () => {
      const preset_id = create().run().preset_id;
      assert.ok(preset_id === null || typeof preset_id === 'string');
    });

    await t.test('умеет превращаться в значение размера', () => {
      const size = create().run().toSize();
      assert.ok(size instanceof SizeVO);
    });

    await t.test('повторный вызов не меняет ответ', () => {
      const action = create();
      assert.equal(action.run().width, action.run().width);
    });
  });
}

/**
 * @param {string} name
 * @param {() => {resize: object, read: object}} create пара «задать размер» и «прочитать»
 */
export function runResizeCanvasContract(name, create) {
  test(`${name}: контракт «задай размер холста»`, async t => {
    const { ResizeCanvasDTO } = app;

    await t.test('возвращает то, что установил', () => {
      const { resize } = create();
      const result = resize.run(new ResizeCanvasDTO(800, 600));
      assert.equal(result.width, 800);
      assert.equal(result.height, 600);
    });

    await t.test('после установки читается тот же размер', () => {
      const { resize, read } = create();
      resize.run(new ResizeCanvasDTO(800, 600));
      assert.equal(read.run().width, 800);
      assert.equal(read.run().height, 600);
    });

    await t.test('свой размер сбрасывает выбранный шаблон', () => {
      const { resize } = create();
      assert.equal(resize.run(new ResizeCanvasDTO(801, 601)).preset_id, null);
    });

    await t.test('невозможный размер подтягивается к границам, а не роняет', () => {
      const { resize } = create();
      assert.doesNotThrow(() => resize.run(new ResizeCanvasDTO(0, 0)));
      assert.ok(resize.run(new ResizeCanvasDTO(0, 0)).width > 0);
    });
  });
}
