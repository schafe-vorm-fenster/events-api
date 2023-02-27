"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataToHtml_1 = require("./dataToHtml");
const htmlToData_1 = require("./htmlToData");
describe("should wrap data in basic html", () => {
    test("returns paragraph with attached url as link", () => {
        const data = {
            description: "Lorem Ipsum",
            url: "https://www.domain.com/",
        };
        expect((0, dataToHtml_1.dataToHtml)(data)).toBe('<p class="p-description">Lorem Ipsum</p>\n<p class="link"><a class="u-url" href="https://www.domain.com/">https://www.domain.com/</a></p>');
    });
    test("returns html as it is with attached url as link", () => {
        const data = {
            description: "<div><p>Lorem <strong>Ipsum</strong></p></div>",
            url: "https://www.domain.com/",
        };
        expect((0, dataToHtml_1.dataToHtml)(data)).toBe('<div><p>Lorem <strong>Ipsum</strong></p></div>\n<p class="link"><a class="u-url" href="https://www.domain.com/">https://www.domain.com/</a></p>');
    });
    test("returns paragraph with tags in a separate line", () => {
        const data = {
            description: "Lorem Ipsum",
            tags: ["One", "Two", "Three"],
        };
        expect((0, dataToHtml_1.dataToHtml)(data)).toBe('<p class="p-description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="p-category">#One</span> <span class="p-category">#Two</span> <span class="p-category">#Three</span></p>');
    });
    test("returns paragraph with scopes in a separate line", () => {
        const data = {
            description: "Lorem Ipsum",
            scopes: ["One", "Two", "Three"],
        };
        expect((0, dataToHtml_1.dataToHtml)(data)).toBe('<p class="p-description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="p-scope">@One</span> <span class="p-scope">@Two</span> <span class="p-scope">@Three</span></p>');
    });
    test("returns paragraph with image included", () => {
        const data = {
            description: "Lorem Ipsum",
            scopes: ["One", "Two", "Three"],
            image: "https://www.domain.com/image.png",
        };
        expect((0, dataToHtml_1.dataToHtml)(data)).toBe('<p class="p-description">Lorem Ipsum</p>\n<img class="u-photo" src="https://www.domain.com/image.png" />\n<p class="taxonomy"><span class="p-scope">@One</span> <span class="p-scope">@Two</span> <span class="p-scope">@Three</span></p>');
    });
    test("returns paragraph with tags and scopes in one separate line", () => {
        const data = {
            description: "Lorem Ipsum",
            tags: ["One", "Two"],
            scopes: ["Three", "Four"],
        };
        expect((0, dataToHtml_1.dataToHtml)(data)).toBe('<p class="p-description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="p-category">#One</span> <span class="p-category">#Two</span> <span class="p-scope">@Three</span> <span class="p-scope">@Four</span></p>');
    });
    test("returns paragraph with url, tags, scopes, and image attached", () => {
        const data = {
            description: "Lorem Ipsum",
            url: "https://www.domain.com/",
            tags: ["One", "Two"],
            scopes: ["Three", "Four"],
            image: "https://www.domain.com/image.png",
        };
        expect((0, dataToHtml_1.dataToHtml)(data)).toBe('<p class="p-description">Lorem Ipsum</p>\n<img class="u-photo" src="https://www.domain.com/image.png" />\n<p class="link"><a class="u-url" href="https://www.domain.com/">https://www.domain.com/</a></p>\n<p class="taxonomy"><span class="p-category">#One</span> <span class="p-category">#Two</span> <span class="p-scope">@Three</span> <span class="p-scope">@Four</span></p>');
    });
});
describe("should keep data after roundtrip transformation", () => {
    test("returns same object", () => {
        const original = {
            description: "Lorem Ipsum",
            url: "https://www.domain.com/",
            tags: ["One", "Two", "Three"],
            scopes: ["One", "Two", "Three"],
            image: "https://www.domain.com/image.png",
        };
        const transformed = (0, htmlToData_1.htmlToData)((0, dataToHtml_1.dataToHtml)(original));
        expect(transformed).toEqual(original);
    });
});
