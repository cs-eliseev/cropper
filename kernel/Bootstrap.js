/* Композиционный корень приложения: связывает общие адаптеры Core,
   объявляет привязки всех модулей и только потом поднимает их.
   Объявление без побочных эффектов — активация после. */

class Bootstrap {
  /**
   * @param {object} settings значения из config.js
   * @param {Array<{register: Function, boot: Function}>} providers провайдеры модулей
   * @returns {Container}
   */
  static run(settings, providers) {
    const container = new Container();

    /* адаптеры Core: без точек входа, поэтому своего провайдера у них нет */
    container.set(EventBusToken, () => new EventBus());
    container.set(KeyValueStorageToken, () => new LocalStorageGateway(settings.storage_prefix));
    const files = new BrowserFileGateway();
    container.set(FileReaderToken, () => files);
    container.set(FileWriterToken, () => files);

    providers.forEach(provider => provider.register(container, settings));
    providers.forEach(provider => provider.boot(container, settings));
    return container;
  }
}
