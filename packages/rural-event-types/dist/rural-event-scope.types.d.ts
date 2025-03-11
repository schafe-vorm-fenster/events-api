import { z } from "zod";
export declare const AdminRuralEventScope: z.ZodEnum<["community", "municipality", "county", "state", "country"]>;
export type RuralEventAdminScope = z.infer<typeof AdminRuralEventScope>;
export declare const DistanceRuralEventScope: z.ZodEnum<["nearby", "region"]>;
export type RuralEventDistanceScope = z.infer<typeof DistanceRuralEventScope>;
export declare const RuralEventScope: z.ZodEnum<["community", "municipality", "county", "state", "country", "nearby", "region"]>;
export type RuralEventScope = z.infer<typeof RuralEventScope>;
export declare function isRuralEventDistanceScope(scopeInQuestion: string): boolean;
export declare function isRuralEventAdminScope(scopeInQuestion: string): boolean;
