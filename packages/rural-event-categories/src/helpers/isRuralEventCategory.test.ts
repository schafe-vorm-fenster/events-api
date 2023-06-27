import { isRuralEventCategory } from "./isRuralEventCategory";

describe("isRuralEventCategory", () => {
  it("should return true for valid category", () => {
    expect(isRuralEventCategory("community-life")).toBeTruthy();
    expect(isRuralEventCategory("education-health")).toBeTruthy();
    expect(isRuralEventCategory("everyday-supply")).toBeTruthy();
  });

  it("should return false for an unknown category", () => {
    expect(isRuralEventCategory("abc-xyz")).toBeFalsy();
  });
});
