import { dataToText } from "./dataToText";
import { textToData } from "./textToData";
import { TextWithData } from "./types";

describe("should integrate data in plain text", () => {
  test("returns text with url in a separate line", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      url: "https://www.domain.com/",
    };
    expect(dataToText(data)).toBe("Lorem Ipsum\n\nhttps://www.domain.com/");
  });

  test("returns text with tags in a separate line", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      tags: ["One", "Two", "Three"],
    };
    expect(dataToText(data)).toBe("Lorem Ipsum\n\n#One #Two #Three");
  });

  test("returns text with scopes in a separate line", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      scopes: ["One", "Two", "Three"],
    };
    expect(dataToText(data)).toBe("Lorem Ipsum\n\n@One @Two @Three");
  });

  test("returns text with tags and scopes in one separate line", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      tags: ["One", "Two", "Three"],
      scopes: ["One", "Two", "Three"],
    };
    expect(dataToText(data)).toBe(
      "Lorem Ipsum\n\n#One #Two #Three @One @Two @Three"
    );
  });

  test("returns text with url, tags and scopes", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      url: "https://www.domain.com/",
      tags: ["One", "Two", "Three"],
      scopes: ["One", "Two", "Three"],
    };
    expect(dataToText(data)).toBe(
      "Lorem Ipsum\n\nhttps://www.domain.com/\n\n#One #Two #Three @One @Two @Three"
    );
  });
});

describe("should keep data after roundtrip transformation", () => {
  test("returns same object", () => {
    const original: TextWithData = {
      description: "Lorem Ipsum",
      url: "https://www.domain.com/",
      tags: ["One", "Two", "Three"],
      scopes: ["One", "Two", "Three"],
    };
    const transformed: TextWithData | null = textToData(dataToText(original));
    expect(transformed).toEqual(original);
  });
});
