import { prefixedStringsFromText, removePrefixedStringsFromText, } from "./prefixedStringsFromText";
describe("should return strings prefixed by a character from plain text", () => {
    test("returns single string", () => {
        const text = "Lorem #string Ipsum";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["string"]);
    });
    test("returns several string", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(3);
        expect(prefixedStringsFromText(text, "#")).toEqual(["One", "Two", "Three"]);
    });
    test("returns camel case string", () => {
        const text = "Lorem #Somestring Ipsum";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["Somestring"]);
    });
    test("returns lower case string", () => {
        const text = "Lorem #string Ipsum";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["string"]);
    });
    test("returns upper case string", () => {
        const text = "Lorem #string Ipsum";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["string"]);
    });
    test("returns minus-separated string", () => {
        const text = "Lorem #some-string Ipsum";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["some-string"]);
    });
    test("returns underscore-separated string", () => {
        const text = "Lorem #some_string Ipsum";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["some_string"]);
    });
    test("returns string at beginning of the text", () => {
        const text = "#string Ipsum";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["string"]);
    });
    test("returns string at end of the text", () => {
        const text = "Ipsum #string";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["string"]);
    });
    test("returns string wrapped in some html", () => {
        const text = "Ipsum <span>#string</span>";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["string"]);
    });
    test("returns string if it's the only content", () => {
        const text = "#string";
        expect(prefixedStringsFromText(text, "#")).toHaveLength(1);
        expect(prefixedStringsFromText(text, "#")).toEqual(["string"]);
    });
    test("returns null if no string found", () => {
        const text = "Lorem Ipsum";
        expect(prefixedStringsFromText(text, "#")).toBeNull();
    });
});
describe("should remove string by # from plain text", () => {
    test("returns string with stripped string", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum #Four";
        expect(removePrefixedStringsFromText(text, "#")).toBe("Lorem Ipsum Lorem Ipsum");
    });
});
