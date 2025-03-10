import { unstable_cacheLife as cacheLife } from "next/cache";
import { getLogger } from "../../../logging/logger";
import { RuralEventClassification } from "../../../packages/rural-event-types/src/rural-event-classification.types";
import { classifyTags } from "./classify-tags";
import { getClassificationApiConfig } from "./helpers/config";

export interface ClassifyContentQuery {
  tags: string[];
  summary: string;
  description: string;
  occurrence?: string;
}

export type ClassifyContentResponse = RuralEventClassification | null;

export const classifyContent = async (
  query: ClassifyContentQuery
): Promise<ClassifyContentResponse> => {
  "use cache";
  cacheLife("classification");

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
      await classifyTags(query.tags);
    // check classification for category and scope
    const classificationResult: ClassifyContentResponse =
      RuralEventClassification.parse(classificationByTags);
    // if classification found with category and scope, then just return it
    if (classificationResult) {
      log.debug(
        { tags: query.tags, classification: classificationResult },
        "Classification done by tags."
      );
      return classificationResult;
    }
  }

  try {
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
      throw new Error(
        `Classification request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    log.debug(`classification api response: ${JSON.stringify(data)}`);

    // check classification for category and scope
    const classificationResult: ClassifyContentResponse =
      RuralEventClassification.parse(data as RuralEventClassification);

    // if not valid, delegate to error handling
    if (!classificationResult)
      throw new Error("Classification failed with no/invalid result.");

    return classificationResult;
  } catch (error) {
    log.error(
      {
        query: query,
        error: error instanceof Error ? error.message : String(error),
      },
      "Classification failed."
    );
    return null;
  }
};
