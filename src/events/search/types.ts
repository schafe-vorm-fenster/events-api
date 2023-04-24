import {
  GoogleNaturalLanguageL1,
  GoogleNaturalLanguageL2,
  GoogleNaturalLanguageL3,
} from "../../../packages/rural-event-categories/src/types/googleNaturalLanguageCategories";
import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import { RuralEventScope } from "../../../packages/rural-event-types/src/ruralEventScopes";

type url = string;
type geopoint = any; // [number, number]
type occurrence = "once" | "recurring" | "series" | "openinghours";
export interface IndexedEvent {
  id?: string;

  // content
  "summary.de": string;
  "summary.en": string;
  "summary.pl": string;
  "description.de": string;
  "description.en": string;
  "description.pl": string;
  link: url;
  image: url;
  "image.exists": boolean;
  document: url;
  "document.exists": boolean;
  categories: RuralEventCategoryId[];
  "classification.l1": GoogleNaturalLanguageL1[];
  "classification.l2": GoogleNaturalLanguageL2[];
  "classification.l3": GoogleNaturalLanguageL3[];

  // date and time
  start: number;
  end: number;
  allday: boolean;
  occurrence: occurrence;
  "series.id": string;
  "location.raw": string;
  "location.name": string;
  "location.localname": string;
  "location.address": string;
  "location.geopoint": geopoint;
  scope: RuralEventScope;
  "community.id": string;
  "community.geopoint": geopoint;
  "community.name": string;
  "municipality.id": string;
  "municipality.name": string;
  "county.id": string;
  "county.name": string;
  "state.id": string;
  "state.name": string;
  "country.id": string;
  "country.name": string;
  "organizer.id": string;
  "organizer.name": string;
  "calendar.id": string;
  "calendar.name": string;
  created: number;
  changed: number | undefined;
  deleted: number | undefined;
}
