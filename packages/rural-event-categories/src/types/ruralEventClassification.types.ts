import { RuralEventCategoryId } from "./ruralEventCategory.types";

export interface RuralEventClassification {
  category: RuralEventCategoryId;
  tags: string[];
  classifications: string[];
}
