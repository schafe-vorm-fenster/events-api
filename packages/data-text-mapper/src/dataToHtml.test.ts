import { dataToHtml } from "./dataToHtml";
import { htmlToData } from "./htmlToData";
import { TextWithData } from "./types";

describe("should wrap data in basic html", () => {
  test("returns paragraph with attached url as link", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      url: "https://www.domain.com/",
    };
    expect(dataToHtml(data)).toBe(
      '<p class="description">Lorem Ipsum</p>\n<p class="link"><a href="https://www.domain.com/">https://www.domain.com/</a></p>'
    );
  });

  test("returns html as it is with attached url as link", () => {
    const data: TextWithData = {
      description: "<div><p>Lorem <strong>Ipsum</strong></p></div>",
      url: "https://www.domain.com/",
    };
    expect(dataToHtml(data)).toBe(
      '<div><p>Lorem <strong>Ipsum</strong></p></div>\n<p class="link"><a href="https://www.domain.com/">https://www.domain.com/</a></p>'
    );
  });

  test("returns paragraph with tags in a separate line", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      tags: ["One", "Two", "Three"],
    };
    expect(dataToHtml(data)).toBe(
      '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="tag">#Three</span></p>'
    );
  });

  test("returns paragraph with scopes in a separate line", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      scopes: ["One", "Two", "Three"],
    };
    expect(dataToHtml(data)).toBe(
      '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="scope">@One</span> <span class="scope">@Two</span> <span class="scope">@Three</span></p>'
    );
  });

  test("returns paragraph with tags and scopes in one separate line", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      tags: ["One", "Two"],
      scopes: ["Three", "Four"],
    };
    expect(dataToHtml(data)).toBe(
      '<p class="description">Lorem Ipsum</p>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="scope">@Three</span> <span class="scope">@Four</span></p>'
    );
  });

  test("returns paragraph with url, tags and scopes attached", () => {
    const data: TextWithData = {
      description: "Lorem Ipsum",
      url: "https://www.domain.com/",
      tags: ["One", "Two"],
      scopes: ["Three", "Four"],
    };
    expect(dataToHtml(data)).toBe(
      '<p class="description">Lorem Ipsum</p>\n<p class="link"><a href="https://www.domain.com/">https://www.domain.com/</a></p>\n<p class="taxonomy"><span class="tag">#One</span> <span class="tag">#Two</span> <span class="scope">@Three</span> <span class="scope">@Four</span></p>'
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
    const transformed: TextWithData | null = htmlToData(dataToHtml(original));
    expect(transformed).toEqual(original);
  });
});
