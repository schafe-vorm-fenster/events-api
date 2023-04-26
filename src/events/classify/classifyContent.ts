import { getLogger } from "../../../logging/logger";
import { client } from "../../../logging/loggerApps.config";
import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import { EventClassification } from "../events.types";
import { classifyByTag } from "./classifyByTag";

export const classifyContent = async (
  tags: string[],
  textInEnglish: string
): Promise<EventClassification | null> => {
  const log = getLogger(client.classification.classify);

  // if tags, then use classifyByTag for each tag ion parallel by Promise.all
  let categoriesByTags: any[] | undefined = undefined;
  if (tags && tags.length > 0) {
    categoriesByTags = await Promise.all(
      tags.map(async (tag) => {
        return await classifyByTag(tag);
      })
    );
  }
  let mappedCategories: RuralEventCategoryId[] | undefined = undefined;
  if (categoriesByTags && categoriesByTags.length > 0) {
    mappedCategories = categoriesByTags.filter((category) => category !== null);
  }

  // if a category was found by tag, then return it
  if (mappedCategories && mappedCategories.length > 0) {
    return {
      categories: mappedCategories,
      "classification.l1": undefined,
      "classification.l2": undefined,
      "classification.l3": undefined,
    };
  }

  // if not, go on with classification by text
  // TODO: implement

  return {
    categories: mappedCategories,
    "classification.l1": ["/Travel"], // TODO: replace dummy
    "classification.l2": ["/Travel/Tourist Destinations"], // TODO: replace dummy
    "classification.l3": [],
  };
};
