/* Заглушки модуля «Кадр» для тех, кто им пользуется (сейчас — «Экспорт»).
   Публикуются вместе с контрактами и проходят те же контрактные тесты,
   что и настоящие действия. */

import { app } from '#app';

const { FrameGeometryDTO } = app;

/** @implements {GetFrameGeometryInterface} */
export class FakeFrameGeometry {
  #geometry;

  /** @param {object} [fields] чем отличается от картинки 2400×1600 в заполнении */
  constructor(fields = {}) {
    const base = {
      has_image: true, image_width: 2400, image_height: 1600,
      zoom: 1, offset_x: 0.5, offset_y: 0.5, image_name: 'photo.png'
    };
    const merged = Object.assign(base, fields);
    this.#geometry = new FrameGeometryDTO(
      merged.has_image, merged.image_width, merged.image_height,
      merged.zoom, merged.offset_x, merged.offset_y, merged.image_name
    );
  }

  run() { return this.#geometry; }

  /** @returns {FakeFrameGeometry} кадр без картинки */
  static empty() {
    return new FakeFrameGeometry({ has_image: false, image_width: 0, image_height: 0, image_name: '' });
  }
}

/** @implements {RenderFrameInterface} */
export class FakeRenderFrame {
  calls = [];

  run(dto) {
    this.calls.push({ width: dto.width, height: dto.height, matte: dto.matte, context: dto.context });
    if (dto.context && dto.context.fillRect) dto.context.fillRect(0, 0, dto.width, dto.height);
  }

  last() { return this.calls[this.calls.length - 1] || null; }
}
