import {
  htmlToData,
  textToData,
  TextWithData,
} from "../../../packages/data-text-mapper/src";
import { containsHtml } from "../../../packages/data-text-mapper/src/helpers/containsHtml";
import { EventMetadata } from "../events.types";

export const getMetadataFromContent = (body: string): EventMetadata | null => {
  if (!body) throw new Error("body is required");

  // extract tags from body
  let textWithData: TextWithData | null;
  if (containsHtml(body)) {
    textWithData = htmlToData(body);
  } else {
    textWithData = textToData(body);
  }

  return {
    url: textWithData?.url || "",
    tags: textWithData?.tags || [],
    scopes: textWithData?.scopes || [],
    image: textWithData?.image || "",
  };
};
