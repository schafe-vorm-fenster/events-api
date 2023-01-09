"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tagsFromText_1 = require("./tagsFromText");
describe("should return tags by # from plain text", () => {
    test("returns single tag", () => {
        const text = "Lorem #Tag Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["Tag"]);
    });
    test("returns several tags", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(3);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["One", "Two", "Three"]);
    });
    test("returns camel case tag", () => {
        const text = "Lorem #SomeTag Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["SomeTag"]);
    });
    test("returns lower case tag", () => {
        const text = "Lorem #tag Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["tag"]);
    });
    test("returns upper case tag", () => {
        const text = "Lorem #TAG Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["TAG"]);
    });
    test("returns minus-separated tag", () => {
        const text = "Lorem #some-tag Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["some-tag"]);
    });
    test("returns underscore-separated tag", () => {
        const text = "Lorem #some_tag Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["some_tag"]);
    });
    test("returns tag at beginning of the text", () => {
        const text = "#tag Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["tag"]);
    });
    test("returns tag at end of the text", () => {
        const text = "Ipsum #tag";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["tag"]);
    });
    test("returns tag if it's the only content", () => {
        const text = "#tag";
        expect((0, tagsFromText_1.tagsFromText)(text)).toHaveLength(1);
        expect((0, tagsFromText_1.tagsFromText)(text)).toEqual(["tag"]);
    });
    test("returns null if no tags found", () => {
        const text = "Lorem Ipsum";
        expect((0, tagsFromText_1.tagsFromText)(text)).toBeNull();
    });
});
describe("should remove tags by # from plain text", () => {
    test("returns string with stripped tags", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum #Four";
        expect((0, tagsFromText_1.removeTagsFromText)(text)).toBe("Lorem Ipsum Lorem Ipsum");
    });
});
