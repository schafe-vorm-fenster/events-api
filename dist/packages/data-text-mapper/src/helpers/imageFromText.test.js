"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageFromText_1 = require("./imageFromText");
describe("should return a valid iage url from a plain text", () => {
    test("returns simple url", () => {
        const text = "Lorem https://www.domain.com/hello.png Ipsum";
        expect((0, imageFromText_1.imageFromText)(text)).toBe("https://www.domain.com/hello.png");
    });
    test("returns image url with path", () => {
        const text = "Lorem https://www.domain.com/path/hello.png Ipsum";
        const url = (0, imageFromText_1.imageFromText)(text);
        expect((0, imageFromText_1.imageFromText)(text)).toBe("https://www.domain.com/path/hello.png");
    });
    test("returns image url from url with parameters", () => {
        const text = "Lorem https://www.domain.com/path/hello.png?param=value Ipsum";
        const url = (0, imageFromText_1.imageFromText)(text);
        expect((0, imageFromText_1.imageFromText)(text)).toBe("https://www.domain.com/path/hello.png?param=value");
    });
    test("returns first image url if multiple image urls are includes", () => {
        const text = "Lorem https://www.first.de/hello.png Ipsum https://www.second.de/world.jpg Lorem";
        const url = (0, imageFromText_1.imageFromText)(text);
        expect(url).toBe("https://www.first.de/hello.png");
    });
    test("returns first image url if multiple urls are includes", () => {
        const text = "Lorem https://www.first.de/ Ipsum https://www.second.de/hello.png Lorem";
        const url = (0, imageFromText_1.imageFromText)(text);
        expect(url).toBe("https://www.second.de/hello.png");
    });
    test("returns null if no image url is included", () => {
        const text = "Lorem https://www.first.de/ Ipsum";
        const url = (0, imageFromText_1.imageFromText)(text);
        expect(url).toBeNull();
    });
    test("returns null if no url is included", () => {
        const text = "Lorem Ipsum";
        const url = (0, imageFromText_1.imageFromText)(text);
        expect(url).toBeNull();
    });
});
describe("should remove url from plain text", () => {
    test("returns string with stripped url", () => {
        const text = "Lorem https://www.domain.com/path/hello.png Ipsum";
        expect((0, imageFromText_1.removeImageFromText)(text)).toBe("Lorem  Ipsum");
    });
    // TODO: Think about how to handle multiple urls
    // TODO: Think about how to handle double spaces cause by url removal
});
