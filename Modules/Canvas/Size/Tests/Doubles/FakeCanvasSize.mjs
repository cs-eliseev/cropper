/* Заглушка модуля «Размер холста» для тех, кто им пользуется.
   Публикуется вместе с контрактом: её прогоняют через те же контрактные
   тесты, что и настоящее действие, поэтому тест на заглушке что-то значит. */

import { app } from '#app';

const { CanvasSizeDTO, SizeVO } = app;

export class FakeCanvasSize {
  #size;
  #preset_id;
  resizes = [];

  /** @param {number} width @param {number} height */
  constructor(width = 1000, height = 1000) {
    this.#size = new SizeVO(width, height);
    this.#preset_id = null;
  }

  /** GetCanvasSizeInterface @returns {CanvasSizeDTO} */
  run() { return new CanvasSizeDTO(this.#size.getWidth(), this.#size.getHeight(), this.#preset_id); }

  /** ResizeCanvasInterface — отдельный объект, потому что контракт = одна операция */
  get resizer() {
    const owner = this;
    return {
      run(dto) {
        owner.resizes.push({ width: dto.width, height: dto.height });
        owner.#size = SizeVO.clamped(dto.width, dto.height);
        owner.#preset_id = null;
        return owner.run();
      }
    };
  }
}
