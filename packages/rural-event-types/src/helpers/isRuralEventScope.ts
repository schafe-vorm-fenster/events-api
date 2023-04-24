import { AllRuralEventScopes, RuralEventScope } from "../ruralEventScopes";

export function isRuralEventScope(scopeInQuestion: string): boolean {
  return AllRuralEventScopes.includes(scopeInQuestion as RuralEventScope);
}
