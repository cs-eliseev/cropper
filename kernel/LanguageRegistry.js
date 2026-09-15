/* Словари, подключённые файлами рядом со страницей, складываются сюда.
   Композиционный корень заберёт их и передаст модулю настроек. */

const LANGUAGE_DEFINITIONS = [];

/** @param {{code: string, name: string, dir?: string, strings: object}} definition */
function defineLanguage(definition) {
  LANGUAGE_DEFINITIONS.push(definition);
}
