import { getCommunityFilter } from "./getCommunityFilter";

describe("should create a community filter", () => {
  test("return a community filter string", () => {
    const filter: string = getCommunityFilter("geoname.2838887");
    expect(filter).toBe("community.id:geoname.2838887");
  });
  test("throws an error on missing or invaid community id", () => {
    expect(() => {
      getCommunityFilter("");
    }).toThrowError();
    expect(() => {
      getCommunityFilter("abc");
    }).toThrowError();
  });
});
