import {
  GoogleNaturalLanguageL1,
  GoogleNaturalLanguageL2,
  GoogleNaturalLanguageL3,
} from "../../../packages/rural-event-categories/src/types/googleNaturalLanguageCategories";
import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import { RuralEventScope } from "../../../packages/rural-event-types/src/ruralEventScopes";

type url = string;
type geopoint = any; // [number, number]
type occurrence = "once" | "recurring" | "series" | "openinghours" | "schedule";
export interface IndexedEvent {
  id?: string;

  // content
  "summary.de": string;
  "summary.en": string;
  "summary.pl": string;
  "summary.uk": string;
  "summary.ru": string;
  "description.de": string;
  "description.en": string;
  "description.pl": string;
  "description.uk": string;
  "description.ru": string;
  link: url;
  image: url;
  "image.exists": boolean;
  document: url;
  "document.exists": boolean;

  // classification
  categories: RuralEventCategoryId[];
  tags: string[];

  // date and time
  start: number;
  end: number;
  allday: boolean;
  occurrence: occurrence;
  "series.id": string;
  "location.raw": string;
  "location.name.de": string;
  "location.localname.de": string;
  "location.address": string;
  "location.geopoint": geopoint;
  scope: RuralEventScope;
  "community.id": string;
  "community.geopoint": geopoint;
  "community.name.de": string;
  "municipality.id": string;
  "municipality.name.de": string;
  "county.id": string;
  "county.name.de": string;
  "state.id": string;
  "state.name.de": string;
  "country.id": string;
  "country.name.de": string;
  "organizer.id": string;
  "organizer.name": string;
  "calendar.id": string;
  "calendar.name": string;
  created: number;
  changed: number;
  deleted: number;
}
