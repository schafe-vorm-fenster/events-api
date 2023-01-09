import { cleanSpaces } from "./helpers/cleanSpaces";
import { containsHtml } from "./helpers/containsHtml";
import { TextWithData } from "./types";

const dataToHtml = (data: TextWithData): string => {
  let descriptionLine: string = cleanSpaces(data.description);
  if (!containsHtml(descriptionLine)) {
    descriptionLine = `<p class="description">${descriptionLine}</p>`;
  }

  const urlLine: string | null = data.url
    ? `<p class="link"><a href="${data.url}">${data.url}</a></p>`
    : null;

  const tags: string | null =
    data.tags
      ?.map((tag: string) => `<span class="tag">#${tag}</span>`)
      .join(" ") || null;

  const scopes: string | null =
    data.scopes
      ?.map((scope: string) => `<span class="scope">@${scope}</span>`)
      .join(" ") || null;

  const tagScopeLine: string | null =
    tags || scopes
      ? '<p class="taxonomy">' +
        [tags, scopes].filter((item) => item !== null).join(" ") +
        "</p>"
      : null;

  return [descriptionLine, urlLine, tagScopeLine]
    .filter((line) => line !== null)
    .join("\n");
};

export { dataToHtml };
