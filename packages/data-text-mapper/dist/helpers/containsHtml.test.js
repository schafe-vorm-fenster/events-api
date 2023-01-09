"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const containsHtml_1 = require("./containsHtml");
describe("tests if any html is included in a string", () => {
    test("returns true if some html tag found", () => {
        const text = "<p>Lorem</p>";
        expect((0, containsHtml_1.containsHtml)(text)).toBeTruthy();
    });
    test("returns true if some closing html tag found", () => {
        const text = "Lorem <br/> Ipsum";
        expect((0, containsHtml_1.containsHtml)(text)).toBeTruthy();
    });
    test("returns false if no html found", () => {
        const text = "Lorem Ipsum";
        expect((0, containsHtml_1.containsHtml)(text)).toBeFalsy();
    });
});
