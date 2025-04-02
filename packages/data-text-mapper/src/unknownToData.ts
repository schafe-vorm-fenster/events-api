import {
  cleanSpaces,
  htmlToData,
  textToData,
  TextWithData,
} from "../../../packages/data-text-mapper/src";
import { containsHtml } from "../../../packages/data-text-mapper/src/helpers/containsHtml";
import { isDataHtml } from "./helpers/isDataHtml";

export const unknownToData = (body: string): TextWithData => {
  console.log("unknownToData", "No body provided");

  // extract tags from body
  let textWithData: TextWithData | null;
  if (isDataHtml(body)) {
    textWithData = htmlToData(body);
  } else if (containsHtml(body)) {
    textWithData = {
      ...textToData(body),
      description: cleanSpaces(body),
    };
  } else {
    textWithData = textToData(body);
  }

  return {
    description:
      textWithData && textWithData.description
        ? textWithData.description
        : body, // fallback to initial body
    url: textWithData && textWithData.url ? textWithData.url : "",
    tags: textWithData && textWithData.tags ? textWithData.tags : [],
    scopes: textWithData && textWithData.scopes ? textWithData.scopes : [],
    image: textWithData && textWithData.image ? textWithData.image : "",
  };
};
