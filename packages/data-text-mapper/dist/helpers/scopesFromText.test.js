"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scopesFromText_1 = require("./scopesFromText");
describe("should return scopes by @ from plain text", () => {
    test("returns single scope", () => {
        const text = "Lorem @scope Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["scope"]);
    });
    test("returns several scopes", () => {
        const text = "Lorem @One Ipsum @Two Lorem @Three Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(3);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["One", "Two", "Three"]);
    });
    test("returns camel case scope", () => {
        const text = "Lorem @Somescope Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["Somescope"]);
    });
    test("returns lower case scope", () => {
        const text = "Lorem @scope Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["scope"]);
    });
    test("returns upper case scope", () => {
        const text = "Lorem @scope Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["scope"]);
    });
    test("returns minus-separated scope", () => {
        const text = "Lorem @some-scope Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["some-scope"]);
    });
    test("returns underscore-separated scope", () => {
        const text = "Lorem @some_scope Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["some_scope"]);
    });
    test("returns scope at beginning of the text", () => {
        const text = "@scope Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["scope"]);
    });
    test("returns scope at end of the text", () => {
        const text = "Ipsum @scope";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["scope"]);
    });
    test("returns scope if it's the only content", () => {
        const text = "@scope";
        expect((0, scopesFromText_1.scopesFromText)(text)).toHaveLength(1);
        expect((0, scopesFromText_1.scopesFromText)(text)).toEqual(["scope"]);
    });
    test("returns null if no scopes found", () => {
        const text = "Lorem Ipsum";
        expect((0, scopesFromText_1.scopesFromText)(text)).toBeNull();
    });
});
describe("should remove scopes by @ from plain text", () => {
    test("returns string with stripped scopes", () => {
        const text = "Lorem @One Ipsum @Two Lorem @Three Ipsum @Four";
        expect((0, scopesFromText_1.removeScopesFromText)(text)).toBe("Lorem Ipsum Lorem Ipsum");
    });
});
