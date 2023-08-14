import { getLogger } from "../../../logging/logger";
import { client } from "../../../logging/loggerApps.config";
import { RuralEventClassification } from "../../../packages/rural-event-categories/src/types/ruralEventClassification.types";
import { classifyByTags } from "./classifyByTags";

export const classifyContent = async (
  tags: string[],
  textInEnglish: string
): Promise<RuralEventClassification | null> => {
  const log = getLogger(client.classification.classify);

  // if tags, then use classifyByTags
  let classificationByTags: RuralEventClassification | null | undefined =
    undefined;
  if (tags && tags.length > 0) {
    classificationByTags = await classifyByTags(tags);
  }

  log.debug("classificationByTag: " + JSON.stringify(classificationByTags));
  if (classificationByTags && classificationByTags.category)
    return classificationByTags;

  // if no tags, then use classifyByText
  // TODO: implement

  return {
    category: "unknown",
    tags: [],
    classifications: [],
  };
};
