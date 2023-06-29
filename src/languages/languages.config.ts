const languages = require("@cospired/i18n-iso-languages");

// TODO: add typing instead of any
export const svfLocales: any = {
  de: {
    de: languages.getName("de", "de"),
    en: languages.getName("de", "en"),
    pl: languages.getName("de", "pl"),
    uk: languages.getName("de", "uk"),
    ru: languages.getName("de", "ru"),
  },
  en: {
    de: languages.getName("en", "de"),
    en: languages.getName("en", "en"),
    pl: languages.getName("en", "pl"),
    uk: languages.getName("en", "uk"),
    ru: languages.getName("en", "ru"),
  },
  pl: {
    de: languages.getName("pl", "de"),
    en: languages.getName("pl", "en"),
    pl: languages.getName("pl", "pl"),
    uk: languages.getName("pl", "uk"),
    ru: languages.getName("pl", "ru"),
  },
  uk: {
    de: languages.getName("uk", "de"),
    en: languages.getName("uk", "en"),
    pl: languages.getName("uk", "pl"),
    uk: languages.getName("uk", "uk"),
    ru: languages.getName("uk", "ru"),
  },

  ru: {
    de: languages.getName("ru", "de"),
    en: languages.getName("ru", "en"),
    pl: languages.getName("ru", "pl"),
    uk: languages.getName("ru", "uk"),
    ru: languages.getName("ru", "ru"),
  },
};
