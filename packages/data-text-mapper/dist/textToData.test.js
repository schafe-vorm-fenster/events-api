"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataToText_1 = require("./dataToText");
const textToData_1 = require("./textToData");
describe("should return extracted data from a plain text", () => {
    test("returns object with url", () => {
        const text = "Lorem https://www.domain.com/ Ipsum";
        const object = (0, textToData_1.textToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.url).toBe("https://www.domain.com/");
    });
    test("returns object with tags", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum";
        const object = (0, textToData_1.textToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.tags).toHaveLength(3);
        expect(object === null || object === void 0 ? void 0 : object.tags).toEqual(["One", "Two", "Three"]);
    });
    test("returns object with scopes", () => {
        const text = "Lorem @One Ipsum @Two Lorem @Three Ipsum";
        const object = (0, textToData_1.textToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toHaveLength(3);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toEqual(["One", "Two", "Three"]);
    });
    test("returns object with url stripped from description", () => {
        const text = "Lorem https://www.domain.com/path/param=value Ipsum";
        const object = (0, textToData_1.textToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with tags stripped from description", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum #Four";
        const object = (0, textToData_1.textToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum Lorem Ipsum");
    });
    test("returns object with scopes stripped from description", () => {
        const text = "Lorem @One Ipsum @Two Lorem @Three Ipsum";
        const object = (0, textToData_1.textToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum Lorem Ipsum");
    });
});
describe("should keep text after roundtrip transformation", () => {
    test("returns same text with adjusted line breaks", () => {
        const original = "Lorem Ipsum https://www.domain.com/ #One @Two";
        const transformed = (0, dataToText_1.dataToText)((0, textToData_1.textToData)(original));
        expect(transformed).toBe("Lorem Ipsum\n\nhttps://www.domain.com/\n\n#One @Two");
    });
});
