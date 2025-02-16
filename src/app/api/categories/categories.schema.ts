import { RuralEventCategory, RuralEventCategoryId } from "@/packages/rural-event-categories/src/types/ruralEventCategory.types";
import { ResultSchema } from "@/src/rest/result.schema";
import { z } from "zod";

export const CategoriesSuccessfulSchema = ResultSchema.extend({
  data: z.array(RuralEventCategory) ,
});
