import { z } from "zod";

export const AdminRuralEventScope = z
  .enum([
    "community", // village, populated place
    "municipality", // municipality, city, town, admin4
    "county", // county, district, admin3
    "state", // state, province, region, admin2
    "country", // country, nation, admin1
  ])
  .describe("Scopes enum for rural events based on administrative boundaries.");
export type RuralEventAdminScope = z.infer<typeof AdminRuralEventScope>;

export const DistanceRuralEventScope = z
  .enum([
    "nearby", // nearby the current location approximately 5-7km
    "region", // in the greater region of the current location approximately 20-30km
  ])
  .describe("Scopes enum for rural events based on distance.");

export type RuralEventDistanceScope = z.infer<typeof DistanceRuralEventScope>;

export const RuralEventScope = z
  .enum([...AdminRuralEventScope.options, ...DistanceRuralEventScope.options])
  .describe("Scopes enum for rural events.");
export type RuralEventScope = z.infer<typeof RuralEventScope>;

export function isRuralEventDistanceScope(scopeInQuestion: string): boolean {
  return DistanceRuralEventScope.safeParse(scopeInQuestion).success;
}

export function isRuralEventAdminScope(scopeInQuestion: string): boolean {
  return AdminRuralEventScope.safeParse(scopeInQuestion).success;
}
