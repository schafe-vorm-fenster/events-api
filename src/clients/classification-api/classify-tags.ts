import { getLogger } from "../../../logging/logger";
import { RuralEventClassification } from "../../../packages/rural-event-types/src/rural-event-classification.types";
import { clientLogger } from "@/logging/loggerApps.config";
import { getClassificationApiConfig } from "./helpers/config";

export const classifyTags = async (
  tags: string[]
): Promise<RuralEventClassification | null> => {
  const log = getLogger(clientLogger.classification.bytag);

  // check incoming tags
  if (!tags || tags.length === 0) {
    log.error("no tags given");
    return null;
  }

  try {
    // Get API configuration
    const { host, token } = getClassificationApiConfig();

    // create URL with proper encoding of parameters
    const url = new URL("/api/classify/bytags/", host);
    url.search = new URLSearchParams({ tags: tags.join(",") }).toString();

    // classify by using the classification api with fetch
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Sheep-Token": token,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const classification: RuralEventClassification = await response.json();

    // check response body for valid classification or delete to error handling
    if (!classification || !classification?.category)
      throw new Error("Classification failed with no/invalid result.");

    log.debug(
      { tags: tags, classification: classification },
      "Successfully classified by tags."
    );
    return classification;
  } catch (error) {
    log.error(
      { tags: tags, error: (error as Error)?.message },
      "Classification error."
    );
    return null;
  }
};
