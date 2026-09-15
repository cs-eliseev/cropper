/* Заглушки портов, которыми пользуется модуль «Кадр». */

import { app } from '#app';

const { SourceImageVO, SizeVO, PickedFileDTO, ThemeTokensDTO, ImageNotReadableException } = app;

/** файл, как будто выбранный на диске */
export function pickedFile(name = 'photo.png') {
  return new PickedFileDTO(name, 'image/png', { size: 1 });
}

/** картинка, как будто раскодированная браузером */
export function sourceImage(width = 2400, height = 1600, name = 'photo.png') {
  return new SourceImageVO({ tag: 'stub-image' }, new SizeVO(width, height), name);
}

/** @implements {ImageDecoderInterface} */
export class FakeImageDecoder {
  #image;
  #error;
  calls = 0;

  constructor(image = sourceImage(), error = null) {
    this.#image = image;
    this.#error = error;
  }

  async decode(file) {
    this.calls += 1;
    if (this.#error) throw this.#error;
    return this.#image;
  }

  static broken(name = 'photo.png') {
    return new FakeImageDecoder(null, new ImageNotReadableException(name));
  }
}

/** @implements {FileReaderInterface} */
export class FakeFileReader {
  #file;
  picks = 0;

  constructor(file = pickedFile()) {
    this.#file = file;
  }

  async pick() { this.picks += 1; return this.#file; }
  async pickText() { this.picks += 1; return this.#file; }

  static empty() { return new FakeFileReader(null); }
}

/** запоминает, что и куда рисовали */
export class FakePainter {
  images = [];
  placeholders = [];

  paintImage(context, width, height, image, rect, scale, matte) {
    this.images.push({ context, width, height, image, rect, scale, matte });
  }

  paintPlaceholder(context, width, height, tokens) {
    this.placeholders.push({ context, width, height, tokens });
  }

  last() { return this.images[this.images.length - 1] || null; }
}

/** @implements {ThemeTokensInterface} */
export class FakeThemeTokens {
  invalidations = 0;

  read() { return new ThemeTokensDTO('#000000', '#111111', '#222222'); }
  invalidate() { this.invalidations += 1; }
}
