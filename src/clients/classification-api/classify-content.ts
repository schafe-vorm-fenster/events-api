// import { unstable_cacheLife as cacheLife } from "next/cache";
import { getLogger } from "../../logging/logger";
import {
  RuralEventClassification,
  RuralEventClassificationSchema,
} from "../../../packages/rural-event-types/src/rural-event-classification.types";
import { classifyTags } from "./classify-tags";
import { getClassificationApiConfig } from "./helpers/config";
import { ClientClassification } from "@/src/logging/loggerApps.config";
import {
  ClassifyContentQuery,
  ClassifyContentQuerySchema,
  ClassifyContentResponse,
  ClassifyContentResponseSchema,
  FallbackClassification,
} from "./classify-content.types";
import { ApiError } from "next/dist/server/api-utils";

const log = getLogger(ClientClassification.classify);

export const classifyContent = async (
  query: ClassifyContentQuery
): Promise<ClassifyContentResponse> => {
  // "use cache";
  // cacheLife("classification");

  // check incoming params
  try {
    ClassifyContentQuerySchema.parse(query);

    // if tags, then use classifyByTags
    if (query.tags && query.tags.length > 0) {
      const classificationByTags: RuralEventClassification | null =
        await classifyTags({ tags: query.tags as [string, ...string[]] });
      // check classification for category and scope
      const classificationResult: ClassifyContentResponse =
        RuralEventClassificationSchema.parse(classificationByTags);
      // if classification found with category and scope, then just return it
      if (classificationResult) {
        log.debug(
          { tags: query.tags, classification: classificationResult },
          "Classification done by tags."
        );
        return classificationResult;
      }
    }

    // Get API configuration
    const { host, token } = getClassificationApiConfig();

    // if no tags, then classify by using the classification api with fetch at SVF_CLASSIFICATIONAPI_URL
    const url = new URL("/api/classify/byobject", host);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Sheep-Token": token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: query.summary || "",
        content: query?.description || "",
        occourance: query?.occurrence || "",
      }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    // check classification for category and scope
    const classification: ClassifyContentResponse = await response.json();
    ClassifyContentResponseSchema.parse(classification);

    log.debug(
      { query: query, data: classification },
      "Classify content successful"
    );
    return classification;
  } catch (error) {
    log.error(
      {
        error: error,
        query: query,
      },
      "Classify content failed"
    );
    return FallbackClassification;
  }
};
