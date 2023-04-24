import { jest } from "@jest/globals";
import { googleDatetimeToTimestamp } from "./googleDatetimeToTimestamp";

const googleDateObjectToTimestamp = require("./googleDateObjectToTimestamp.ts");
const googleDatetimeObjectToTimestamp = require("./googleDatetimeObjectToTimestamp.ts");
const googleDatetimeStringToTimestamp = require("./googleDatetimeStringToTimestamp.ts");

describe("should use the correct convert function dependent on the incoming type", () => {
  test("use googleDateObjectToTimestamp for date string", async () => {
    const mock = jest.spyOn(
      googleDateObjectToTimestamp,
      "googleDateObjectToTimestamp"
    );
    googleDatetimeToTimestamp({
      date: "2023-03-29",
    });
    expect(mock).toHaveBeenCalled();
  });

  test("use googleDatetimeObjectToTimestamp for datetime object", () => {
    const mock = jest.spyOn(
      googleDatetimeObjectToTimestamp,
      "googleDatetimeObjectToTimestamp"
    );
    googleDatetimeToTimestamp({
      dateTime: "2023-03-25T14:00:00+01:00",
      timeZone: "Europe/Berlin",
    });
    expect(mock).toHaveBeenCalled();
  });

  test("use googleDatetimeStringToTimestamp for datetime string", () => {
    const mock = jest.spyOn(
      googleDatetimeStringToTimestamp,
      "googleDatetimeStringToTimestamp"
    );
    googleDatetimeToTimestamp({ dateTime: "2023-03-24T07:01:51.045Z" });
    expect(mock).toHaveBeenCalled();
  });
});

describe("should return null for broken incoming type", () => {
  test("return null for missing property", async () => {
    const timestamp: number | null = googleDatetimeToTimestamp({
      timeZone: "Europe/Berlin",
    });
    expect(timestamp).toBeNull();
  });
});
