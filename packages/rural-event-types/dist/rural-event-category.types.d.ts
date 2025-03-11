import { z } from "zod";
/**
 * The id of a rural event category. This is used to classify events by a fixed hard-coded structure. It's also used to indexing and searching.
 */
export declare const RuralEventCategoryId: z.ZodEnum<["community-life", "education-health", "everyday-supply", "culture-tourism", "unknown"]>;
export type RuralEventCategoryId = z.infer<typeof RuralEventCategoryId>;
/**
 * Type for a localization of a rural event category for display purpose.
 */
export declare const RuralEventCategoryLocalization: z.ZodObject<{
    short: z.ZodString;
    name: z.ZodString;
    examples: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    locale: z.ZodString;
}, "strip", z.ZodTypeAny, {
    short: string;
    name: string;
    locale: string;
    examples?: string[] | undefined;
}, {
    short: string;
    name: string;
    locale: string;
    examples?: string[] | undefined;
}>;
export type RuralEventCategoryLocalization = z.infer<typeof RuralEventCategoryLocalization>;
/**
 * Type for a localizes rural event category for display purpose.
 */
export declare const RuralEventCategory: z.ZodObject<{
    id: z.ZodEnum<["community-life", "education-health", "everyday-supply", "culture-tourism", "unknown"]>;
    localizations: z.ZodArray<z.ZodObject<{
        short: z.ZodString;
        name: z.ZodString;
        examples: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        locale: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        short: string;
        name: string;
        locale: string;
        examples?: string[] | undefined;
    }, {
        short: string;
        name: string;
        locale: string;
        examples?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: "community-life" | "education-health" | "everyday-supply" | "culture-tourism" | "unknown";
    localizations: {
        short: string;
        name: string;
        locale: string;
        examples?: string[] | undefined;
    }[];
}, {
    id: "community-life" | "education-health" | "everyday-supply" | "culture-tourism" | "unknown";
    localizations: {
        short: string;
        name: string;
        locale: string;
        examples?: string[] | undefined;
    }[];
}>;
export type RuralEventCategory = z.infer<typeof RuralEventCategory>;
/**
 * The list of all rural event categories incl. localizations.
 */
export declare const RuralEventCategoryList: z.ZodArray<z.ZodObject<{
    id: z.ZodEnum<["community-life", "education-health", "everyday-supply", "culture-tourism", "unknown"]>;
    localizations: z.ZodArray<z.ZodObject<{
        short: z.ZodString;
        name: z.ZodString;
        examples: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        locale: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        short: string;
        name: string;
        locale: string;
        examples?: string[] | undefined;
    }, {
        short: string;
        name: string;
        locale: string;
        examples?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: "community-life" | "education-health" | "everyday-supply" | "culture-tourism" | "unknown";
    localizations: {
        short: string;
        name: string;
        locale: string;
        examples?: string[] | undefined;
    }[];
}, {
    id: "community-life" | "education-health" | "everyday-supply" | "culture-tourism" | "unknown";
    localizations: {
        short: string;
        name: string;
        locale: string;
        examples?: string[] | undefined;
    }[];
}>, "many">;
export type RuralEventCategoryList = z.infer<typeof RuralEventCategoryList>;
