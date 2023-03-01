/**
 * The id of a rural event category. This is used to classify events by a fixed hard-coded structure. It's also used to indexing and searching.
 */
export type RuralEventCategoryId =
  | "community-life"
  | "education-health"
  | "everyday-supply"
  | "culture-tourism";

/**
 * Type for a localization of a rural event category for display purpose.
 */
export interface RuralEventCategoryLocalization {
  short: string;
  name: string;
  examples: string[];
  locale: string;
}

/**
 * Type for a localizes rural event category for display purpose.
 */
export interface RuralEventCategory {
  id: RuralEventCategoryId;
  localizations: RuralEventCategoryLocalization[];
}
