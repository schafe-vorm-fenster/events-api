import { dataToText } from "./dataToText";
import { textToData } from "./textToData";
describe("should return extracted data from a plain text", () => {
    test("returns object with url", () => {
        const text = "Lorem https://www.domain.com/ Ipsum";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.url).toBe("https://www.domain.com/");
    });
    test("returns object with image url", () => {
        const text = "Lorem https://www.domain.com/hello.png Ipsum";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.image).toBe("https://www.domain.com/hello.png");
    });
    test("returns object with tags", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.tags).toHaveLength(3);
        expect(object === null || object === void 0 ? void 0 : object.tags).toEqual(["One", "Two", "Three"]);
    });
    test("returns object with scopes", () => {
        const text = "Lorem @One Ipsum @Two Lorem @Three Ipsum";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toHaveLength(3);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toEqual(["One", "Two", "Three"]);
    });
    test("returns object with url stripped from description", () => {
        const text = "Lorem https://www.domain.com/path/param=value Ipsum";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with image url stripped from description", () => {
        const text = "Lorem https://www.domain.com/hello.png Ipsum";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum");
    });
    test("returns object with tags stripped from description", () => {
        const text = "Lorem #One Ipsum #Two Lorem #Three Ipsum #Four";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum Lorem Ipsum");
    });
    test("returns object with scopes stripped from description", () => {
        const text = "Lorem @One Ipsum @Two Lorem @Three Ipsum";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.description).toBe("Lorem Ipsum Lorem Ipsum");
    });
    // add test which retrieves tag even if it is at the end
    // add test which retrieves scope even if it is at the end
    // add test which retrieves tags or scopes even if it is at the end and ignore < or >
    test("returns object with tags or scopes stripped from description", () => {
        const text = "Lorem #One Ipsum </hr>#Two Lorem @Three Ipsum @Four</br>";
        const object = textToData(text);
        expect(object === null || object === void 0 ? void 0 : object.tags).toHaveLength(2);
        expect(object === null || object === void 0 ? void 0 : object.tags).toEqual(["One", "Two"]);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toHaveLength(2);
        expect(object === null || object === void 0 ? void 0 : object.scopes).toEqual(["Three", "Four"]);
    });
});
describe("should keep text after roundtrip transformation", () => {
    test("returns same text with adjusted line breaks", () => {
        const original = "Lorem Ipsum https://www.domain.com/ #One @Two";
        const transformed = dataToText(textToData(original));
        expect(transformed).toBe("Lorem Ipsum\n\nhttps://www.domain.com/\n\n#One @Two");
    });
});
