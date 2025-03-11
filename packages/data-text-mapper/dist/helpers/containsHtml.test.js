import { containsHtml } from "./containsHtml";
describe("tests if any html is included in a string", () => {
    test("returns true if some html tag found", () => {
        const text = "<p>Lorem</p>";
        expect(containsHtml(text)).toBeTruthy();
    });
    test("returns true if some closing html tag found", () => {
        const text = "Lorem <br/> Ipsum";
        expect(containsHtml(text)).toBeTruthy();
    });
    test("returns false if no html found", () => {
        const text = "Lorem Ipsum";
        expect(containsHtml(text)).toBeFalsy();
    });
});
