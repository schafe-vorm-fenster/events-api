"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataToHtml_1 = require("./dataToHtml");
const htmlToData_1 = require("./htmlToData");
describe("should return extracted data from html", () => {
    test("returns object with plain text description", () => {
        const html = '<p class="description">Lorem Ipsum</p>';
        const object = (0, htmlToData_1.htmlToData)(html);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with html description", () => {
        const html = '<div class="someclass">Lorem Ipsum</div>';
        const object = (0, htmlToData_1.htmlToData)(html);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe(html);
    });
    test("returns object with url", () => {
        const html = '<p class="link"><a href="https://www.domain.com/">https://www.domain.com/</a></p>';
        const object = (0, htmlToData_1.htmlToData)(html);
        expect(object === null || object === void 0 ? void 0 : object.url).toBe("https://www.domain.com/");
    });
    test("returns object with tags", () => {
        const html = '<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="tag">#Three</span></p>';
        const object = (0, htmlToData_1.htmlToData)(html);
        expect(object === null || object === void 0 ? void 0 : object.tags).toHaveLength(3);
        expect(object === null || object === void 0 ? void 0 : object.tags).toEqual(["One", "Two", "Three"]);
    });
    test("returns object with scopes", () => {
        const html = '<p class="taxonomy"><span class="scope">@One</span> <span class="scope">@Two</span></p>';
        const object = (0, htmlToData_1.htmlToData)(html);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toHaveLength(2);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toEqual(["One", "Two"]);
    });
    test("returns object with link stripped from description", () => {
        const text = '<p class="description">Lorem Ipsum</p>\n<p class="link"><a href="https://www.domain.com/">https://www.domain.com/</a></p>';
        const object = (0, htmlToData_1.htmlToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with tags stripped from description", () => {
        const text = '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="tag">#Three</span></p>';
        const object = (0, htmlToData_1.htmlToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with scopes stripped from description", () => {
        const text = '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="scope">@One</span> <span class="scope">@Two</span></p>';
        const object = (0, htmlToData_1.htmlToData)(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
});
describe("should keep html after roundtrip transformation", () => {
    test("return same html", () => {
        const original = '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="scope">@Three</span> <span class="scope">@Four</span></p>';
        const transformed = (0, dataToHtml_1.dataToHtml)((0, htmlToData_1.htmlToData)(original));
        expect(transformed).toBe(original);
    });
    test("return same html even with custom markup", () => {
        const original = '<div class="description">Lorem Ipsum</div>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="scope">@Three</span> <span class="scope">@Four</span></p>';
        const transformed = (0, dataToHtml_1.dataToHtml)((0, htmlToData_1.htmlToData)(original));
        expect(transformed).toBe(original);
    });
});
