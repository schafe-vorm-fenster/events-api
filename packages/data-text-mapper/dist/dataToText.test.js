"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataToText_1 = require("./dataToText");
const textToData_1 = require("./textToData");
describe("should integrate data in plain text", () => {
    test("returns text with url in a separate line", () => {
        const data = {
            description: "Lorem Ipsum",
            url: "https://www.domain.com/",
        };
        expect((0, dataToText_1.dataToText)(data)).toBe("Lorem Ipsum\n\nhttps://www.domain.com/");
    });
    test("returns text with tags in a separate line", () => {
        const data = {
            description: "Lorem Ipsum",
            tags: ["One", "Two", "Three"],
        };
        expect((0, dataToText_1.dataToText)(data)).toBe("Lorem Ipsum\n\n#One #Two #Three");
    });
    test("returns text with scopes in a separate line", () => {
        const data = {
            description: "Lorem Ipsum",
            scopes: ["One", "Two", "Three"],
        };
        expect((0, dataToText_1.dataToText)(data)).toBe("Lorem Ipsum\n\n@One @Two @Three");
    });
    test("returns text with tags and scopes in one separate line", () => {
        const data = {
            description: "Lorem Ipsum",
            tags: ["One", "Two", "Three"],
            scopes: ["One", "Two", "Three"],
        };
        expect((0, dataToText_1.dataToText)(data)).toBe("Lorem Ipsum\n\n#One #Two #Three @One @Two @Three");
    });
    test("returns text with url, tags and scopes", () => {
        const data = {
            description: "Lorem Ipsum",
            url: "https://www.domain.com/",
            tags: ["One", "Two", "Three"],
            scopes: ["One", "Two", "Three"],
        };
        expect((0, dataToText_1.dataToText)(data)).toBe("Lorem Ipsum\n\nhttps://www.domain.com/\n\n#One #Two #Three @One @Two @Three");
    });
});
describe("should keep data after roundtrip transformation", () => {
    test("returns same object", () => {
        const original = {
            description: "Lorem Ipsum",
            url: "https://www.domain.com/",
            tags: ["One", "Two", "Three"],
            scopes: ["One", "Two", "Three"],
        };
        const transformed = (0, textToData_1.textToData)((0, dataToText_1.dataToText)(original));
        expect(transformed).toEqual(original);
    });
});
