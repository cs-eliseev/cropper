/* Заглушки портов, которыми пользуется «Экспорт». */

import { app } from '#app';

const { ExportTargetDTO } = app;

/** @implements {CanvasFactoryInterface} */
export class FakeCanvasFactory {
  created = [];
  #blob;

  /** @param {object|null} blob что вернёт кодировщик; null — браузер не смог */
  constructor(blob = { size: 4096, type: 'image/jpeg' }) {
    this.#blob = blob;
  }

  create(size) {
    const target = {
      width: size.getWidth(), height: size.getHeight(), encodings: [],
      context: { fillRect: () => {}, clearRect: () => {}, drawImage: () => {} }
    };
    this.created.push(target);
    return new ExportTargetDTO(target.context, async (mime, quality) => {
      target.encodings.push({ mime, quality });
      return this.#blob;
    });
  }

  last() { return this.created[this.created.length - 1] || null; }
}

/** @implements {FileWriterInterface} */
export class FakeFileWriter {
  saved = [];

  save(name, blob) { this.saved.push({ name, blob }); }

  last() { return this.saved[this.saved.length - 1] || null; }
}

/** @implements {TranslatorInterface} */
export class FakeTranslator {
  translate(key, vars) {
    return vars ? key + ':' + Object.values(vars).join(',') : key;
  }
}
