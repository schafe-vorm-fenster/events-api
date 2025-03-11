import { z } from "zod";
export const AdminRuralEventScope = z
    .enum([
    "community",
    "municipality",
    "county",
    "state",
    "country", // country, nation, admin1
])
    .describe("Scopes enum for rural events based on administrative boundaries.");
export const DistanceRuralEventScope = z
    .enum([
    "nearby",
    "region", // in the greater region of the current location approximately 20-30km
])
    .describe("Scopes enum for rural events based on distance.");
export const RuralEventScope = z
    .enum([...AdminRuralEventScope.options, ...DistanceRuralEventScope.options])
    .describe("Scopes enum for rural events.");
export function isRuralEventDistanceScope(scopeInQuestion) {
    return DistanceRuralEventScope.safeParse(scopeInQuestion).success;
}
export function isRuralEventAdminScope(scopeInQuestion) {
    return AdminRuralEventScope.safeParse(scopeInQuestion).success;
}
