import { dataToText } from "./dataToText";
import { textToData } from "./textToData";
import { TextWithData } from "./types";

describe("should return extracted data from a plain text", () => {
  test("returns object with url", () => {
    const text: string = "Lorem https://www.domain.com/ Ipsum";
    const object: TextWithData | null = textToData(text);
    expect(object?.url).toBe("https://www.domain.com/");
  });

  test("returns object with image url", () => {
    const text: string = "Lorem https://www.domain.com/hello.png Ipsum";
    const object: TextWithData | null = textToData(text);
    expect(object?.image).toBe("https://www.domain.com/hello.png");
  });

  test("returns object with tags", () => {
    const text: string = "Lorem #One Ipsum #Two Lorem #Three Ipsum";
    const object: TextWithData | null = textToData(text);
    expect(object?.tags).toHaveLength(3);
    expect(object?.tags).toEqual(["One", "Two", "Three"]);
  });

  test("returns object with scopes", () => {
    const text: string = "Lorem @One Ipsum @Two Lorem @Three Ipsum";
    const object: TextWithData | null = textToData(text);
    expect(object?.scopes).toHaveLength(3);
    expect(object?.scopes).toEqual(["One", "Two", "Three"]);
  });

  test("returns object with url stripped from description", () => {
    const text: string = "Lorem https://www.domain.com/path/param=value Ipsum";
    const object: TextWithData | null = textToData(text);
    expect(object?.description).toBe("Lorem Ipsum");
  });

  test("returns object with image url stripped from description", () => {
    const text: string = "Lorem https://www.domain.com/hello.png Ipsum";
    const object: TextWithData | null = textToData(text);
    expect(object?.description).toBe("Lorem Ipsum");
  });

  test("returns object with tags stripped from description", () => {
    const text: string = "Lorem #One Ipsum #Two Lorem #Three Ipsum #Four";
    const object: TextWithData | null = textToData(text);
    expect(object?.description).toBe("Lorem Ipsum Lorem Ipsum");
  });

  test("returns object with scopes stripped from description", () => {
    const text: string = "Lorem @One Ipsum @Two Lorem @Three Ipsum";
    const object: TextWithData | null = textToData(text);
    expect(object?.description).toBe("Lorem Ipsum Lorem Ipsum");
  });
});

describe("should keep text after roundtrip transformation", () => {
  test("returns same text with adjusted line breaks", () => {
    const original: string = "Lorem Ipsum https://www.domain.com/ #One @Two";
    const transformed: string | null = dataToText(
      textToData(original) as TextWithData
    );
    expect(transformed).toBe(
      "Lorem Ipsum\n\nhttps://www.domain.com/\n\n#One @Two"
    );
  });
});
