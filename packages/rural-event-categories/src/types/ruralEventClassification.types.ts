import { RuralEventCategoryId } from "./ruralEventCategory.types";
import { RuralEventScope } from "../../../rural-event-types/src/ruralEventScopes";
export interface RuralEventClassification {
  category: RuralEventCategoryId;
  tags?: string[];
  scope: RuralEventScope;
}
