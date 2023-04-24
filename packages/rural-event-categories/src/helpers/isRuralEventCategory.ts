import { ruralEventCategories } from "../types/ruralEventCategory";

/**
 * Checks if the given event category is a rural event category. Uses ruralEventCategories as source.
 */
export const isRuralEventCategory = (category: string): boolean => {
  return ruralEventCategories.some((ruralEventCategory) => {
    return ruralEventCategory.id === category;
  });
};
