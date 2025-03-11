import { z } from "zod";
/**
 * The id of a rural event category. This is used to classify events by a fixed hard-coded structure. It's also used to indexing and searching.
 */
export const RuralEventCategoryId = z.enum([
    "community-life",
    "education-health",
    "everyday-supply",
    "culture-tourism",
    "unknown",
]);
/**
 * Type for a localization of a rural event category for display purpose.
 */
export const RuralEventCategoryLocalization = z.object({
    short: z.string(),
    name: z.string(),
    examples: z.array(z.string()).optional(),
    locale: z.string(),
});
/**
 * Type for a localizes rural event category for display purpose.
 */
export const RuralEventCategory = z.object({
    id: RuralEventCategoryId,
    localizations: z.array(RuralEventCategoryLocalization),
});
/**
 * The list of all rural event categories incl. localizations.
 */
export const RuralEventCategoryList = z.array(RuralEventCategory);
