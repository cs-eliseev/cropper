/* Адаптер к файловой системе через браузер: input[type=file] на чтение,
   ссылка со скачиванием на запись. Работает и на file://, поэтому
   ни сети, ни локального сервера не требуется. */

/**
 * @implements {FileReaderInterface}
 * @implements {FileWriterInterface}
 */
class BrowserFileGateway {
  /** @param {string} accept @returns {Promise<PickedFileDTO|null>} */
  async pick(accept) {
    const file = await this.#openDialog(accept);
    return file ? new PickedFileDTO(file.name, file.type, file) : null;
  }

  /** @param {string} accept @returns {Promise<PickedFileDTO|null>} */
  async pickText(accept) {
    const file = await this.#openDialog(accept);
    if (!file) return null;
    const text = await this.#readText(file);
    return new PickedFileDTO(file.name, file.type, file, text);
  }

  /** @param {string} name @param {Blob} blob */
  save(name, blob) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  }

  /** @param {string} accept @returns {Promise<File|null>} */
  #openDialog(accept) {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.onchange = () => resolve((input.files && input.files[0]) || null);
      input.click();
    });
  }

  /** @param {File} file @returns {Promise<string>} */
  #readText(file) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('cannot read ' + file.name, { cause: reader.error }));
      reader.readAsText(file);
    });
  }
}
