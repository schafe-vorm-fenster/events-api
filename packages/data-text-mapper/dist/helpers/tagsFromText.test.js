import { removeTagsFromText, tagsFromText } from "./tagsFromText";
describe("should return tags by # from plain text", () => {
    test("returns single tag", () => {
        const text = "Lorem #Tag Ipsum";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["Tag"]);
    });
    test("returns several tags", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum";
        expect(tagsFromText(text)).toHaveLength(3);
        expect(tagsFromText(text)).toEqual(["One", "Two", "Three"]);
    });
    // several tags if </hr> is somewhre in between
    test("returns several tags if </hr> is somewhere in between", () => {
        const text = "Lorem #One Ipsum </hr>#Two Lorem #Three Ipsum";
        expect(tagsFromText(text)).toHaveLength(3);
        expect(tagsFromText(text)).toEqual(["One", "Two", "Three"]);
    });
    test("returns camel case tag", () => {
        const text = "Lorem #SomeTag Ipsum";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["SomeTag"]);
    });
    test("returns lower case tag", () => {
        const text = "Lorem #tag Ipsum";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["tag"]);
    });
    test("returns upper case tag", () => {
        const text = "Lorem #TAG Ipsum";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["TAG"]);
    });
    test("returns minus-separated tag", () => {
        const text = "Lorem #some-tag Ipsum";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["some-tag"]);
    });
    test("returns underscore-separated tag", () => {
        const text = "Lorem #some_tag Ipsum";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["some_tag"]);
    });
    test("returns tag at beginning of the text", () => {
        const text = "#tag Ipsum";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["tag"]);
    });
    test("returns tag at end of the text", () => {
        const text = "Ipsum #tag";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["tag"]);
    });
    test("returns tag if it's the only content", () => {
        const text = "#tag";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["tag"]);
    });
    test("returns tag if it's followed by </br>", () => {
        const text = "#tag</br>";
        expect(tagsFromText(text)).toHaveLength(1);
        expect(tagsFromText(text)).toEqual(["tag"]);
    });
    test("returns null if no tags found", () => {
        const text = "Lorem Ipsum";
        expect(tagsFromText(text)).toBeNull();
    });
});
describe("should remove tags by # from plain text", () => {
    test("returns string with stripped tags", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum #Four";
        expect(removeTagsFromText(text)).toBe("Lorem Ipsum Lorem Ipsum");
    });
});
