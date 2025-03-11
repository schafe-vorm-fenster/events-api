import { describe, it, expect, vi } from "vitest";
import { getEndedBeforeFilter } from "./get-ended-before-filter";

describe("getEndedBeforeFilter", () => {
  it("should return undefined when no date is provided", () => {
    expect(getEndedBeforeFilter()).toBeUndefined();
  });

  it("should return correct filter string for valid ISO8601 date", () => {
    const date = "2024-01-01T00:00:00Z";
    expect(getEndedBeforeFilter(date)).toBe(
      "start:<=1704067200000 && end:<=1704067200000"
    );
  });

  it("should handle 'now' as a valid input", () => {
    vi.useFakeTimers();
    const now = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(now);
    expect(getEndedBeforeFilter("now")).toBe(
      "start:<=1704110400000 && end:<=1704110400000"
    );
    vi.useRealTimers();
  });

  it("should throw error for invalid ISO8601 date format", () => {
    expect(() => getEndedBeforeFilter("invalid-date")).toThrow();
  });
});
