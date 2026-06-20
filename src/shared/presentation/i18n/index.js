import { computed, inject, readonly, ref } from 'vue';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

const DEFAULT_LOCALE = 'en';
const STORAGE_KEY = 'nexora.locale';

const messages = {
  en,
  es
};

const supportedLocales = Object.keys(messages);
const I18N_KEY = Symbol('i18n');

function isSupportedLocale(locale) {
  return supportedLocales.includes(locale);
}

function readStoredLocale() {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(STORAGE_KEY);
  return isSupportedLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE;
}

function resolveMessage(localeMessages, key) {
  return key.split('.').reduce((current, segment) => {
    if (current && Object.prototype.hasOwnProperty.call(current, segment)) {
      return current[segment];
    }

    return undefined;
  }, localeMessages);
}

function interpolate(message, params = {}) {
  return message.replace(/\{(\w+)}/g, (_, name) => {
    return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : '';
  });
}

export function createI18n() {
  const locale = ref(readStoredLocale());

  function setLocale(nextLocale) {
    locale.value = isSupportedLocale(nextLocale) ? nextLocale : DEFAULT_LOCALE;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale.value);
    }
  }

  function t(key, params) {
    const translated = resolveMessage(messages[locale.value], key);
    const fallback = resolveMessage(messages[DEFAULT_LOCALE], key);
    const message = typeof translated === 'string' ? translated : fallback;

    if (typeof message !== 'string') {
      return key;
    }

    return interpolate(message, params);
  }

  const i18n = {
    locale: readonly(locale),
    availableLocales: supportedLocales,
    defaultLocale: DEFAULT_LOCALE,
    setLocale,
    t,
    currentLocale: computed(() => locale.value)
  };

  return {
    install(app) {
      app.provide(I18N_KEY, i18n);
      app.config.globalProperties.$t = t;
    },
    ...i18n
  };
}

export function useI18n() {
  const i18n = inject(I18N_KEY);

  if (!i18n) {
    throw new Error('i18n plugin has not been installed.');
  }

  return i18n;
}
