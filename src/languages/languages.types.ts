type SvfLocale = "de" | "en" | "pl";

interface SvfLanguageLocalization {
  locale: SvfLocale;
  name: string;
}

export interface SvfLanguage {
  locale: SvfLocale;
  localizations: SvfLanguageLocalization[];
}
