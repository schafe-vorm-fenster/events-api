import { isGoogleEvent } from "./isGoogleEvent";

describe("isGoogleEvent", () => {
  test("should return true for valid Google event", () => {
    const validEvent = {
      id: "123",
      kind: "calendar#event",
      start: { dateTime: "2023-01-01T10:00:00Z" },
    };
    expect(isGoogleEvent(validEvent)).toBeTruthy();
  });

  test("should return false when missing required properties", () => {
    const missingId = {
      kind: "calendar#event",
      start: { dateTime: "2023-01-01T10:00:00Z" },
    };
    const missingKind = {
      id: "123",
      start: { dateTime: "2023-01-01T10:00:00Z" },
    };
    const missingStart = {
      id: "123",
      kind: "calendar#event",
    };

    expect(isGoogleEvent(missingId)).toBeFalsy();
    expect(isGoogleEvent(missingKind)).toBeFalsy();
    expect(isGoogleEvent(missingStart)).toBeFalsy();
  });

  test("should return false when kind value is incorrect", () => {
    const wrongKind = {
      id: "123",
      kind: "wrong#event",
      start: { dateTime: "2023-01-01T10:00:00Z" },
    };
    expect(isGoogleEvent(wrongKind)).toBeFalsy();
  });

  test("should return false for invalid inputs", () => {
    expect(isGoogleEvent({} as object)).toBeFalsy();
    expect(isGoogleEvent(null as unknown as object)).toBeFalsy();
    expect(isGoogleEvent(undefined as unknown as object)).toBeFalsy();
  });
});
