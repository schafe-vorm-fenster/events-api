import { dataToHtml } from "./dataToHtml";
import { htmlToData } from "./htmlToData";
describe("should return extracted data from html", () => {
    test("returns object with plain text description", () => {
        const html = '<p class="p-description">Lorem Ipsum</p>';
        const object = htmlToData(html);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with html description", () => {
        const html = '<div class="someclass">Lorem Ipsum</div>';
        const object = htmlToData(html);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe(html);
    });
    test("returns object with url", () => {
        const html = '<p class="link"><a class="u-url" href="https://www.domain.com/">https://www.domain.com/</a></p>';
        const object = htmlToData(html);
        expect(object === null || object === void 0 ? void 0 : object.url).toBe("https://www.domain.com/");
    });
    test("returns object with tags", () => {
        const html = '<p class="taxonomy"><span class="p-category">#One</span> <span class="p-category">#Two</span> <span class="p-category">#Three</span></p>';
        const object = htmlToData(html);
        expect(object === null || object === void 0 ? void 0 : object.tags).toHaveLength(3);
        expect(object === null || object === void 0 ? void 0 : object.tags).toEqual(["One", "Two", "Three"]);
    });
    test("returns object with scopes", () => {
        const html = '<p class="taxonomy"><span class="p-scope">@One</span> <span class="p-scope">@Two</span></p>';
        const object = htmlToData(html);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toHaveLength(2);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toEqual(["One", "Two"]);
    });
    test("returns object with link stripped from description", () => {
        const text = '<p class="p-description">Lorem Ipsum</p>\n<p class="link"><a class="u-url" href="https://www.domain.com/">https://www.domain.com/</a></p>';
        const object = htmlToData(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with tags stripped from description", () => {
        const text = '<p class="p-description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="p-category">#One</span> <span class="p-category">#Two</span> <span class="p-category">#Three</span></p>';
        const object = htmlToData(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with scopes stripped from description", () => {
        const text = '<p class="p-description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="p-scope">@One</span> <span class="p-scope">@Two</span></p>';
        const object = htmlToData(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with image stripped from description", () => {
        const text = '<p class="p-description">Lorem Ipsum</p>\n<img class="u-photo" src="https://www.domain.com/image.png" />';
        const object = htmlToData(text);
        expect(object === null || object === void 0 ? void 0 : object.image).toBe("https://www.domain.com/image.png");
    });
});
describe("should keep html after roundtrip transformation", () => {
    test("return same html", () => {
        const original = '<p class="p-description">Lorem Ipsum</p>\n<img class="u-photo" src="https://www.domain.com/image.png" />\n<p class="taxonomy"><span class="p-category">#One</span> <span class="p-category">#Two</span> <span class="p-scope">@Three</span> <span class="p-scope">@Four</span></p>';
        const transformed = dataToHtml(htmlToData(original));
        expect(transformed).toBe(original);
    });
    test("return same html even with custom markup", () => {
        const original = '<div class="p-description">Lorem Ipsum</div>\n<p class="taxonomy"><span class="p-category">#One</span> <span class="p-category">#Two</span> <span class="p-scope">@Three</span> <span class="p-scope">@Four</span></p>';
        const transformed = dataToHtml(htmlToData(original));
        expect(transformed).toBe(original);
    });
});
