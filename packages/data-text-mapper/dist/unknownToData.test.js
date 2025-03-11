import { unknownToData } from "./unknownToData";
describe("unknownToData", () => {
    test("returns null for empty input", () => {
        expect(unknownToData("")).toBeNull();
    });
    describe("HTML content", () => {
        test("processes data HTML content correctly", () => {
            const dataHtmlContent = '<p class="p-description">Test content</p><a class="u-url" href="https://example.com">link</a><span class="p-category">#tag</span><span class="p-scope">@scope</span>';
            const result = unknownToData(dataHtmlContent);
            expect(result).not.toBeNull();
            // TODO: Review this use case in-depth, it seems like the description is not being extracted correctly
            expect(result === null || result === void 0 ? void 0 : result.description).toBe(`Test content<a class=\"u-url\" href=\"https://example.com\">link</a><span class=\"p-category\">#tag</span><span class=\"p-scope\">@scope</span>`);
            expect(result === null || result === void 0 ? void 0 : result.url).toBe("https://example.com");
            expect(result === null || result === void 0 ? void 0 : result.tags).toEqual(["tag"]);
            expect(result === null || result === void 0 ? void 0 : result.scopes).toEqual(["scope"]);
        });
        test("processes HTML content correctly", () => {
            const htmlContent = "<p>Test content <a href='https://example.com'>link</a> #tag @scope </p>";
            const result = unknownToData(htmlContent);
            expect(result).not.toBeNull();
            expect(result === null || result === void 0 ? void 0 : result.description).toBe(htmlContent);
            expect(result === null || result === void 0 ? void 0 : result.url).toBe("https://example.com");
            expect(result === null || result === void 0 ? void 0 : result.tags).toEqual(["tag"]);
            expect(result === null || result === void 0 ? void 0 : result.scopes).toEqual(["scope"]);
        });
    });
    describe("Plain text content", () => {
        test("processes plain text content correctly", () => {
            const textContent = "Test content https://example.com #tag @scope";
            const result = unknownToData(textContent);
            expect(result).not.toBeNull();
            expect(result === null || result === void 0 ? void 0 : result.description).toBe("Test content");
            expect(result === null || result === void 0 ? void 0 : result.url).toBe("https://example.com");
            expect(result === null || result === void 0 ? void 0 : result.tags).toContain("tag");
            expect(result === null || result === void 0 ? void 0 : result.scopes).toContain("scope");
        });
        test("handles text without special content", () => {
            const plainText = "Just a simple text";
            const result = unknownToData(plainText);
            expect(result).not.toBeNull();
            expect(result === null || result === void 0 ? void 0 : result.description).toBe("Just a simple text");
            expect(result === null || result === void 0 ? void 0 : result.url).toBe("");
            expect(result === null || result === void 0 ? void 0 : result.tags).toHaveLength(0);
            expect(result === null || result === void 0 ? void 0 : result.scopes).toHaveLength(0);
            expect(result === null || result === void 0 ? void 0 : result.image).toBe("");
        });
    });
});
