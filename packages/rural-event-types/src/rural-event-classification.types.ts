import { z } from "zod";
import { RuralEventCategoryId } from "./rural-event-category.types";
import { RuralEventScope } from "./rural-event-scope.types";

export const RuralEventClassification = z.object({
  category: RuralEventCategoryId,
  tags: z.array(z.string()).optional(),
  scope: RuralEventScope,
});

export type RuralEventClassification = z.infer<typeof RuralEventClassification>;
