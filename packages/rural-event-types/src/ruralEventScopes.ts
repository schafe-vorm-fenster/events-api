export const AdminRuralEventScopes = [
  "community",
  "municipality",
  "county",
  "state",
  "country",
] as const;

export type RuralEventAdminScopes = typeof AdminRuralEventScopes;
export type RuralEventAdminScope = RuralEventAdminScopes[number];

export const DistanceRuralEventScopes = [
  "nearby", // nearby the current location approximately 5-7km
  "region", // in the greater region of the current location approximately 20-30km
] as const;

export type RuralEventDistanceScopes = typeof DistanceRuralEventScopes;
export type RuralEventDistanceScope = RuralEventDistanceScopes[number];

export const AllRuralEventScopes = [
  ...AdminRuralEventScopes,
  ...DistanceRuralEventScopes,
] as const;

export type RuralEventScopes = typeof AllRuralEventScopes;
export type RuralEventScope = RuralEventScopes[number];

export function isRuralEventDistanceScope(scopeInQuestion: string): boolean {
  return DistanceRuralEventScopes.includes(
    scopeInQuestion as RuralEventDistanceScope
  );
}

export function isRuralEventAdminScope(scopeInQuestion: string): boolean {
  return AdminRuralEventScopes.includes(
    scopeInQuestion as RuralEventAdminScope
  );
}
