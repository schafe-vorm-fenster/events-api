import axios from "axios";
import { getLogger } from "../../../logging/logger";
import { client } from "../../../logging/loggerApps.config";
import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategory.types";

export const classifyByTag = async (
  tag: string
): Promise<RuralEventCategoryId | null> => {
  const log = getLogger(client.classification.bytag);

  // check env vars
  if (!process.env.SVF_CLASSIFICATIONAPI_HOST) {
    log.error("SVF_CLASSIFICATIONAPI_URL is not set");
    return null;
  }
  if (!process.env.SVF_CLASSIFICATIONAPI_TOKEN) {
    log.error("SVF_CLASSIFICATIONAPI_TOKEN is not set");
    return null;
  }

  // check incoming tags
  if (!tag || tag.length === 0) {
    log.error("no tag given");
    return null;
  }

  const urlSafeTag: string = encodeURI(tag);

  // classify by using the classification api with axios get at SVF_CLASSIFICATIONAPI_URL
  const url: string =
    process.env.SVF_CLASSIFICATIONAPI_HOST + "api/classify/bytag/" + urlSafeTag;
  return await axios
    .get(url, {
      headers: {
        "Sheep-Token": process.env.SVF_CLASSIFICATIONAPI_TOKEN,
        Accept: "application/json",
      },
    })
    .then((response) => {
      if (!response?.data?.id) {
        log.info("classification api response did not contain any result");
      } else {
        log.debug("classified by tag with category " + response.data.id);
        return response.data.id; // TODO: optimize api response handling
      }
    })
    .catch((error) => {
      log.error("classification api error: " + error);
      return null;
    });
};
