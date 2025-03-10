import { RuralEventScope } from "../../../packages/rural-event-types/dist/ruralEventTypes";

export interface ScopeDistance {
  scope: RuralEventScope;
  distance: number;
}

export const scopeDistances: ScopeDistance[] = [
  {
    scope: "nearby",
    distance: 2.5,
  },
  {
    scope: "region",
    distance: 20,
  },
];

export const getScopeDistance = (scope: RuralEventScope): number | null => {
  return (
    scopeDistances.filter((scopeDistance) => scopeDistance.scope == scope)?.[0]
      ?.distance || null
  );
};
