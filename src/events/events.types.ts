import { calendar_v3 } from "@googleapis/calendar";
import { TextWithData } from "../../packages/data-text-mapper/src";
import {
  GoogleNaturalLanguageL1,
  GoogleNaturalLanguageL2,
  GoogleNaturalLanguageL3,
} from "../../packages/rural-event-categories/src/types/googleNaturalLanguageCategories";
import { RuralEventCategoryId } from "../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import Schema$Event = calendar_v3.Schema$Event;

export type PostEventRequestBody = Schema$Event;

export type EventMetadata = Pick<
  TextWithData,
  "url" | "tags" | "scopes" | "image"
>;

export interface EventClassification {
  categories: RuralEventCategoryId[];
  "classification.l1": GoogleNaturalLanguageL1[];
  "classification.l2": GoogleNaturalLanguageL2[];
  "classification.l3": GoogleNaturalLanguageL3[];
}