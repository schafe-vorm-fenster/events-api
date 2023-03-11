import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import { EventClassification } from "../events.types";

export const classifyContent = async (
  tags: string[],
  title: string,
  body: string
): Promise<EventClassification | null> => {
  let mappedCategories: RuralEventCategoryId[] = [];

  // map given tags to RuralEventCategoryId[]
  // TODO: maybe do everything here by the new classification api
  if (tags && tags.length > 0) {
    // TODO: map
    mappedCategories.push("culture-tourism"); // TODO: replace dummy
  }

  // if mapping was unsuccessful, than classify by given title and body with Google Natural Language API
  // TODO: maybe do everythoing here by the new classification api
  if (mappedCategories.length === 0) {
    mappedCategories.push("education-health"); // TODO: replace dummy
  }

  return {
    categories: mappedCategories,
    "classification.l1": ["/Travel"], // TODO: replace dummy
    "classification.l2": ["/Travel/Tourist Destinations"], // TODO: replace dummy
    "classification.l3": [],
  };
};
