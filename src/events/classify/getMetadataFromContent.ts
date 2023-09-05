import { getLogger } from "../../../logging/logger";
import {
  htmlToData,
  textToData,
  TextWithData,
} from "../../../packages/data-text-mapper/src";
import { containsHtml } from "../../../packages/data-text-mapper/src/helpers/containsHtml";
import { EventContentWithMetadata } from "../events.types";

export const getMetadataFromContent = (
  body: string
): EventContentWithMetadata | null => {
  const log = getLogger("events.classify.getMetadataFromContent");
  if (!body) {
    log.info("No body to extract metadata from");
    return null;
  }

  // extract tags from body
  let textWithData: TextWithData | null;
  if (containsHtml(body)) {
    textWithData = htmlToData(body);
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
