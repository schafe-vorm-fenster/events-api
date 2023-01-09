import { dataToHtml } from "./dataToHtml";
import { dataToText } from "./dataToText";
import { htmlToData } from "./htmlToData";
import { TextWithData } from "./types";

describe("should return extracted data from html", () => {
  test("returns object with plain text description", () => {
    const html: string = '<p class="description">Lorem Ipsum</p>';
    const object: TextWithData | null = htmlToData(html);
    expect(object?.description).toBe("Lorem Ipsum");
  });

  test("returns object with html description", () => {
    const html: string = '<div class="someclass">Lorem Ipsum</div>';
    const object: TextWithData | null = htmlToData(html);
    expect(object?.description).toBe(html);
  });

  test("returns object with url", () => {
    const html: string =
      '<p class="link"><a href="https://www.domain.com/">https://www.domain.com/</a></p>';
    const object: TextWithData | null = htmlToData(html);
    expect(object?.url).toBe("https://www.domain.com/");
  });

  test("returns object with tags", () => {
    const html: string =
      '<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="tag">#Three</span></p>';
    const object: TextWithData | null = htmlToData(html);
    expect(object?.tags).toHaveLength(3);
    expect(object?.tags).toEqual(["One", "Two", "Three"]);
  });

  test("returns object with scopes", () => {
    const html: string =
      '<p class="taxonomy"><span class="scope">@One</span> <span class="scope">@Two</span></p>';
    const object: TextWithData | null = htmlToData(html);
    expect(object?.scopes).toHaveLength(2);
    expect(object?.scopes).toEqual(["One", "Two"]);
  });

  test("returns object with link stripped from description", () => {
    const text: string =
      '<p class="description">Lorem Ipsum</p>\n<p class="link"><a href="https://www.domain.com/">https://www.domain.com/</a></p>';
    const object: TextWithData | null = htmlToData(text);
    expect(object?.description).toBe("Lorem Ipsum");
  });

  test("returns object with tags stripped from description", () => {
    const text: string =
      '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="tag">#Three</span></p>';
    const object: TextWithData | null = htmlToData(text);
    expect(object?.description).toBe("Lorem Ipsum");
  });

  test("returns object with scopes stripped from description", () => {
    const text: string =
      '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="scope">@One</span> <span class="scope">@Two</span></p>';
    const object: TextWithData | null = htmlToData(text);
    expect(object?.description).toBe("Lorem Ipsum");
  });
});

describe("should keep html after roundtrip transformation", () => {
  test("return same html", () => {
    const original: string =
      '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="scope">@Three</span> <span class="scope">@Four</span></p>';
    const transformed: string | null = dataToHtml(
      htmlToData(original) as TextWithData
    );
    expect(transformed).toBe(original);
  });
  test("return same html even with custom markup", () => {
    const original: string =
      '<div class="description">Lorem Ipsum</div>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="scope">@Three</span> <span class="scope">@Four</span></p>';
    const transformed: string | null = dataToHtml(
      htmlToData(original) as TextWithData
    );
    expect(transformed).toBe(original);
  });
});
