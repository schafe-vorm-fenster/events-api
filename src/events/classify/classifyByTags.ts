import axios from "axios";
import { getLogger } from "../../../logging/logger";
import { client } from "../../../logging/loggerApps.config";
import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import { RuralEventClassification } from "../../../packages/rural-event-categories/src/types/ruralEventClassification.types";

export const classifyByTags = async (
  tags: string[]
): Promise<RuralEventClassification | null> => {
  const log = getLogger(client.classification.bytag);

  // check env vars
  if (
    !process.env.SVF_CLASSIFICATIONAPI_HOST ||
    process.env.SVF_CLASSIFICATIONAPI_HOST.length <= 1
  ) {
    log.error("SVF_CLASSIFICATIONAPI_URL is not set");
    return null;
  }
  if (
    !process.env.SVF_CLASSIFICATIONAPI_TOKEN ||
    process.env.SVF_CLASSIFICATIONAPI_TOKEN.length <= 1
  ) {
    log.error("SVF_CLASSIFICATIONAPI_TOKEN is not set");
    return null;
  }

  // check incoming tags
  if (!tags || tags.length === 0) {
    log.error("no tags given");
    return null;
  }

  // create a comma separated list of tags, which are each uri encoded
  const urlSafeTags: string = tags.map((tag) => encodeURI(tag)).join(",");
  log.debug("urlSafeTags: " + urlSafeTags);

  // classify by using the classification api with axios get at SVF_CLASSIFICATIONAPI_URL
  const url: string =
    process.env.SVF_CLASSIFICATIONAPI_HOST +
    "api/classify/bytags/?tags=" +
    urlSafeTags;
  return await axios
    .get(url, {
      headers: {
        "Sheep-Token": process.env.SVF_CLASSIFICATIONAPI_TOKEN,
        Accept: "application/json",
      },
    })
    .then((response) => {
      const classification: RuralEventClassification =
        response.data as RuralEventClassification;

      // check response body for valid classification or delete to error handling
      if (!classification || !classification?.category)
        throw new Error("Classification failed with no/invalid result.");

      log.debug(
        { tags: tags, classification: classification },
        "Successfully classified by tags."
      );
      return response.data as RuralEventClassification;
    })
    .catch((error) => {
      log.error({ tags: tags, error: error?.message }, "Classification error.");
      return null;
    });
};
