import { z } from "zod";
export declare const RuralEventClassification: z.ZodObject<{
    category: z.ZodEnum<["community-life", "education-health", "everyday-supply", "culture-tourism", "unknown"]>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    scope: z.ZodEnum<["community", "municipality", "county", "state", "country", "nearby", "region"]>;
}, "strip", z.ZodTypeAny, {
    category: "community-life" | "education-health" | "everyday-supply" | "culture-tourism" | "unknown";
    scope: "community" | "municipality" | "county" | "state" | "country" | "nearby" | "region";
    tags?: string[] | undefined;
}, {
    category: "community-life" | "education-health" | "everyday-supply" | "culture-tourism" | "unknown";
    scope: "community" | "municipality" | "county" | "state" | "country" | "nearby" | "region";
    tags?: string[] | undefined;
}>;
export type RuralEventClassification = z.infer<typeof RuralEventClassification>;
