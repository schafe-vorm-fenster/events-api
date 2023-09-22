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
  occurrence?: string;
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
  if (classification && classification?.category && classification?.scope) {
    return classification;
  }

  return null;
};

export const classifyContent = async (
  query: ClassifyContentQuery,
  fallback?: ClassifyContentQuery
): Promise<ClassifyContentResponse> => {
  const log = getLogger("events.classify.classifyContent");

  // check incoming params
  if (!query) {
    log.error("No query given.");
    return null;
  }
  if (!query.tags || !query.summary || query.summary.length <= 0) {
    log.error("No tags or summary given.");
    return null;
  }

  // if tags, then use classifyByTags
  if (query.tags && query.tags.length > 0) {
    const classificationByTags: RuralEventClassification | null =
      await classifyByTags(query.tags);
    // check classification for category and scope
    const classificationResult: ClassifyContentResponse =
      validRuralEventClassification(classificationByTags);
    // if classification found with category and scope, then just return it
    if (classificationResult) {
      log.debug(
        { tags: query.tags, classification: classificationResult },
        "Classification done by tags."
      );
      return classificationResult;
    }
  }

  // if no tags, then classify by using the classification api with axios post at SVF_CLASSIFICATIONAPI_URL
  const url: string =
    process.env.SVF_CLASSIFICATIONAPI_HOST + "api/classify/byobject";

  return axios
    .post(
      url,
      {
        title: query.summary || "",
        content: query?.description || "",
        occourance: query?.occurrence || "",
      },
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

      // check classification for category and scope
      const classificationResult: ClassifyContentResponse =
        validRuralEventClassification(
          response.data as RuralEventClassification
        );

      // if not valid, delegate to error handling
      if (!classificationResult)
        throw new Error("Classification failed with no/invalid result.");

      return classificationResult;
    })
    .catch((error) => {
      log.error(
        { query: query, error: error?.message },
        "Classification failed."
      );
      return null;
    });
};
