import { calendar_v3 } from "@googleapis/calendar";
import { TextWithData } from "../../packages/data-text-mapper/src";
import {
  GoogleNaturalLanguageL1,
  GoogleNaturalLanguageL2,
  GoogleNaturalLanguageL3,
} from "../../packages/rural-event-categories/src/types/googleNaturalLanguageCategories";
import { RuralEventCategoryId } from "../../packages/rural-event-types/src/rural-event-category.types";
import Schema$Event = calendar_v3.Schema$Event;

export type PostEventRequestBody = Schema$Event;

export type EventContentWithMetadata = TextWithData;

export interface EventClassification {
  categories: RuralEventCategoryId[] | undefined;
  "classification.l1": GoogleNaturalLanguageL1[] | undefined;
  "classification.l2": GoogleNaturalLanguageL2[] | undefined;
  "classification.l3": GoogleNaturalLanguageL3[] | undefined;
}
