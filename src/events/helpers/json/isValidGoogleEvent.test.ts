import { calendar_v3 } from "@googleapis/calendar";
import Schema$Event = calendar_v3.Schema$Event;
import { isValidGoogleEvent } from "./isValidGoogleEvent";

describe("should check a json if it is a valid google event object", () => {
  test("true for minimal fields available", () => {
    const eventOne: Schema$Event = {
      id: "123",
      kind: "calendar#event",
      summary: "test",
      start: { date: "today" },
      location: "some address",
    };
    expect(isValidGoogleEvent(eventOne)).toBeTruthy();

    const eventTwo: Schema$Event = {
      id: "123",
      kind: "calendar#event",
      summary: "test",
      start: { dateTime: "today" },
      location: "some address",
    };
    expect(isValidGoogleEvent(eventTwo)).toBeTruthy();
  });

  test("throw error if minimal data attributes are missing", () => {
    const event: Schema$Event = { etag: "world" };
    expect(() => {
      isValidGoogleEvent(event);
    }).toThrowError();
  });

  test("throw error if minimal data is empty", () => {
    const event: Schema$Event = {
      id: "123",
      kind: "calendar#event",
      summary: "",
      start: { date: "today" },
      location: "",
    };
    expect(() => {
      isValidGoogleEvent(event);
    }).toThrowError();
  });
});
