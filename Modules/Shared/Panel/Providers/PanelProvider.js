/* Композиционный корень модуля «Панель». */

const PanelProvider = {
  /** @param {Container} container @param {object} settings */
  register(container, settings) {
    container.set(PanelRepositoryToken, c => new PanelRepository(
      c.get(KeyValueStorageToken),
      settings.panel_blocks,
      settings.panel_open_blocks
    ));
  },

  /** @param {Container} container */
  boot(container) {
    const nodes = {
      panel: document.getElementById('panel'),
      body: document.getElementById('panelBody'),
      title: document.querySelector('.panel__title'),
      toggle: document.getElementById('panelToggle'),
      mode: document.getElementById('multi'),
      all: document.getElementById('all')
    };

    const events = container.get(EventBusToken);
    const panel = container.get(PanelRepositoryToken);
    const view = new PanelView(panel, container.get(TranslatorToken), nodes);

    new PanelController({
      toggleBlock: new ToggleBlockAction(panel, events),
      togglePanel: new TogglePanelAction(panel, events),
      setMode: new SetAccordionModeAction(panel, events),
      toggleAll: new ToggleAllBlocksAction(panel, events)
    }, nodes).mount();

    const subscriber = new PanelEventSubscriber(view);
    [PanelChangedEvent, LanguageChangedEvent].forEach(event => events.subscribe(event, subscriber));

    view.arrange();
    view.render();
  }
};
