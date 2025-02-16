import { z } from "zod";

export const Locale = z.enum(["de", "en", "pl", "uk", "ru"]);
export type Locale = z.infer<typeof Locale>;

export const LanguageLocalization = z.object({
  de: z.string().optional(),
  en: z.string().optional(),
  pl: z.string().optional(),
  uk: z.string().optional(),
  ru: z.string().optional(),
});
export type LanguageLocalization = z.infer<typeof LanguageLocalization>;

export const Language = z.object({
  id: Locale,
  localizations: z.array(LanguageLocalization),
});
export type Language = z.infer<typeof Language>;

export const LanguageList = z.array(Language);
export type LanguageList = z.infer<typeof LanguageList>;
