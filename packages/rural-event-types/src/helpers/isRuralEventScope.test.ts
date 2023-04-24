import { isRuralEventScope } from "./isRuralEventScope";

// unit tests for isRuralEventScope
describe("isRuralEventScope", () => {
  it("should return true for valid admin scope", () => {
    expect(isRuralEventScope("community")).toBe(true);
  });
  it("should return true for a valid distance scope", () => {
    expect(isRuralEventScope("region")).toBe(true);
  });
  it("should return false for an invalid scope", () => {
    expect(isRuralEventScope("invalid")).toBe(false);
  });
});
