import { cleanSpaces } from "./cleanSpaces";
describe("should clean plain text by reducing multiple spaces and breaks", () => {
    test("reduces double spaces", () => {
        const text = "Lorem  Ipsum";
        expect(cleanSpaces(text)).toBe("Lorem Ipsum");
    });
    test("reduces multiple spaces", () => {
        const text = "Lorem    Ipsum";
        expect(cleanSpaces(text)).toBe("Lorem Ipsum");
    });
    test("keep double line breaks", () => {
        const text = "Lorem\n\nIpsum";
        expect(cleanSpaces(text)).toBe("Lorem\n\nIpsum");
    });
    test("reduces multiple line breaks to max two", () => {
        const text = "Lorem\n\n\nIpsum";
        expect(cleanSpaces(text)).toBe("Lorem\n\nIpsum");
    });
    test("reduces line breaks at the end", () => {
        const text = "Lorem Ipsum\n";
        expect(cleanSpaces(text)).toBe("Lorem Ipsum");
    });
    test("replace \r line breaks", () => {
        const text = "Lorem\r\rIpsum";
        expect(cleanSpaces(text)).toBe("Lorem\n\nIpsum");
    });
    test("replace \r\n line breaks", () => {
        const text = "Lorem\r\n\r\nIpsum";
        expect(cleanSpaces(text)).toBe("Lorem\n\nIpsum");
    });
    test("trim string", () => {
        const text = " Lorem Ipsum ";
        expect(cleanSpaces(text)).toBe("Lorem Ipsum");
    });
});
