import { getLogger } from "../../logging/logger";
import {
  RuralEventClassification,
  RuralEventClassificationSchema,
} from "../../../packages/rural-event-types/src/rural-event-classification.types";
import { ClientClassification } from "@/src/logging/loggerApps.config";
import { getClassificationApiConfig } from "./helpers/config";
import {
  ClassifyByTagsQuery,
  ClassifyByTagsQuerySchema,
} from "./classify-tags.types";
import { ApiError } from "next/dist/server/api-utils";
// import { cacheLife } from "next/dist/server/use-cache/cache-life";

const log = getLogger(ClientClassification.bytag);

export const classifyTags = async (
  query: ClassifyByTagsQuery
): Promise<RuralEventClassification | null> => {
  // "use cache";
  // cacheLife("classification");

  try {
    // check incoming tags
    ClassifyByTagsQuerySchema.parse(query);

    // Get API configuration
    const { host, token } = getClassificationApiConfig();

    // create URL with proper encoding of parameters
    const url = new URL("/api/classify/bytags/", host);
    url.search = new URLSearchParams({ tags: query.tags.join(",") }).toString();
    log.debug(
      { query, url: url.toString() },
      "Get classification by tags from classification API"
    );
    // classify by using the classification api with fetch
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Sheep-Token": token,
        Accept: "application/json",
      },
      // TODO: Add query cache
    });
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    const classification: RuralEventClassification = await response.json();
    // check response body for valid classification or delete to error handling
    RuralEventClassificationSchema.parse(classification);

    log.debug(
      { query: query, data: classification },
      "Classify tags successful"
    );
    return classification;
  } catch (error) {
    log.error(
      {
        error: error,
        query: query,
      },
      "Classify tags failed"
    );
    throw new Error("Classify tags failed", {
      cause: error,
    });
  }
};
