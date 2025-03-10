import {
  cleanSpaces,
  htmlToData,
  textToData,
  TextWithData,
} from "../../../packages/data-text-mapper/src";
import { containsHtml } from "../../../packages/data-text-mapper/src/helpers/containsHtml";
import { isDataHtml } from "./helpers/isDataHtml";

export const unknownToData = (body: string): TextWithData | null => {
  if (!body) return null;

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
    description: textWithData?.description || "",
    url: textWithData?.url || "",
    tags: textWithData?.tags || [],
    scopes: textWithData?.scopes || [],
    image: textWithData?.image || "",
  };
};
