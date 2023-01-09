import { cleanSpaces } from "./helpers/cleanSpaces";
import { removeScopesFromText, scopesFromText } from "./helpers/scopesFromText";
import { removeTagsFromText, tagsFromText } from "./helpers/tagsFromText";
import { removeUrlFromText, urlFromText } from "./helpers/urlFromText";
import { TextWithData } from "./types";

const htmlToData = (text: string): TextWithData | null => {
  let description: string = text;

  // strip link tag from description
  description = description.replace(
    new RegExp('(<p class="link">.*</p>)', "gi"),
    ""
  );

  // strip taxonomy tag from description
  description = description.replace(
    new RegExp('(<p class="taxonomy">.*</p>)', "gi"),
    ""
  );

  // strip html from description if wrapped in known tag
  if (description.match('<p class="description">.*</p>'))
    description = description
      .replace('<p class="description">', "")
      .replace("</p>", "");

  // final cleanup of the description
  description = cleanSpaces(description);

  const textWithData: TextWithData = {
    description: description,
    url: urlFromText(text) || undefined,
    tags: tagsFromText(text) || undefined,
    scopes: scopesFromText(text) || undefined,
  };

  return textWithData;
};

export { htmlToData };
