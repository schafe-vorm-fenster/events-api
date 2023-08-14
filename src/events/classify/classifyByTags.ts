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
      // TODO: better create json with type newly
      log.debug(
        "classification api response: " + JSON.stringify(response.data)
      );

      if (!response?.data?.category) {
        log.info("classification api response did not contain any result");
        return null;
      } else {
        log.debug("classified by tags with category " + response.data.category);
        return response.data as RuralEventClassification;
      }
    })
    .catch((error) => {
      log.error("classification api error: " + error);
      return null;
    });
};
