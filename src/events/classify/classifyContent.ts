import getUuidByString from "uuid-by-string";
import { getLogger } from "../../../logging/logger";
import { client } from "../../../logging/loggerApps.config";
import { RuralEventClassification } from "../../../packages/rural-event-categories/src/types/ruralEventClassification.types";
import { classifyByTags } from "./classifyByTags";
import axios from "axios";

export interface ClassifyContentQuery {
  tags: string[];
  summary: string;
  description: string;
}

export type ClassifyContentResponse = RuralEventClassification | null;

/**
 * Passes through the incoming classification, if it's valid. Otherwise returns null.
 * @param classification
 * @returns
 */
const validRuralEventClassification = (
  classification: ClassifyContentResponse
): ClassifyContentResponse => {
  if (classification && classification.category) {
    return classification;
  }

  return null;
};

export const classifyContent = async (
  query: ClassifyContentQuery,
  fallback?: ClassifyContentQuery
): Promise<ClassifyContentResponse> => {
  const log = getLogger("events.classify.classifyContent");

  // prepare result object
  let classificationResult: ClassifyContentResponse = null;

  // if tags, then use classifyByTags
  if (query.tags && query.tags.length > 0) {
    const classificationByTags: RuralEventClassification | null =
      await classifyByTags(query.tags);
    log.debug("classificationByTag: " + JSON.stringify(classificationByTags));
    classificationResult = validRuralEventClassification(classificationByTags);
  }

  // if no tags, then use classifyByText
  if (!classificationResult && query.summary && query.summary.length > 0) {
    // classify by using the classification api with axios post at SVF_CLASSIFICATIONAPI_URL
    const hash: string = getUuidByString(query.summary + query.description);
    const url: string =
      process.env.SVF_CLASSIFICATIONAPI_HOST + "api/classify/byobject/" + hash;

    log.debug("url: " + url, url);

    const classificationResult: any = await axios
      .post(
        url,
        { summary: query.summary || "", description: query.description || "" },
        {
          headers: {
            "Sheep-Token": process.env.SVF_CLASSIFICATIONAPI_TOKEN,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        log.debug(
          "classification api response: " + JSON.stringify(response.data)
        );
        return response.data;
      })
      .catch((error) => {
        log.error("classification api error: " + error, error);
        return null;
      });

    return classificationResult;
  }

  log.error("no classification found");
  return null;
};
