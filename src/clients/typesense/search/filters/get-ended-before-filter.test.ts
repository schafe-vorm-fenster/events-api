import { getEndedBeforeFilter } from "./get-ended-before-filter";

describe("getEndedBeforeFilter", () => {
  it("should return undefined when no date is provided", () => {
    const filter = getEndedBeforeFilter(undefined);
    expect(filter).toBeUndefined();
  });

  it("should return correct filter string for valid ISO8601 date", () => {
    const date = "2024-01-01T12:00:00Z";
    const timestamp = new Date(date).getTime();
    const filter = getEndedBeforeFilter(date);
    expect(filter).toBe(`start:<=${timestamp} && end:<=${timestamp}`);
  });

  it("should handle 'now' as a valid input", () => {
    jest.useFakeTimers();
    const now = new Date("2024-01-01T12:00:00Z");
    jest.setSystemTime(now);

    const filter = getEndedBeforeFilter("now");
    expect(filter).toBe(`start:<=${now.getTime()} && end:<=${now.getTime()}`);

    jest.useRealTimers();
  });

  it("should throw error for invalid ISO8601 date format", () => {
    expect(() => {
      getEndedBeforeFilter("invalid-date");
    }).toThrow();

    expect(() => {
      getEndedBeforeFilter("2024-13-01T12:00:00Z");
    }).toThrow();
  });
});
