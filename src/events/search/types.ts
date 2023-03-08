import {
  GoogleNaturalLanguageL1,
  GoogleNaturalLanguageL2,
  GoogleNaturalLanguageL3,
} from "../../../packages/rural-event-categories/src/types/googleNaturalLanguageCategories";
import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategoryTypes";
import { RuralEventScope } from "../../../packages/rural-event-types/dist/ruralEventTypes";

type url = string;
type geopoint = [number, number];
export interface IndexedEvent {
  // content
  "summary.de": string;
  "summary.en": string;
  "summary.pl": string;
  "description.de": string;
  "description.en": string;
  "description.pl": string;
  link: url;
  image: url;
  document: url;
  categories: RuralEventCategoryId[];
  "classification.l1": GoogleNaturalLanguageL1[];
  "classification.l2": GoogleNaturalLanguageL2[];
  "classification.l3": GoogleNaturalLanguageL3[];

  // date and time
  start: number;
  end: number;
  allday: boolean;
  occurrence: string;
  "location.raw": string;
  "location.name": string;
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
