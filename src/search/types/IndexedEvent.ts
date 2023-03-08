import {
  GoogleNaturalLanguageL1,
  GoogleNaturalLanguageL2,
  GoogleNaturalLanguageL3,
} from "../../../packages/rural-event-categories/src/types/googleNaturalLanguageCategories";
import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategoryTypes";

type url = string;

export interface IndexedEvent {
  id: string;

  // content
  summary_de: string;
  summary_en: string;
  summary_pl: string;
  description_de: string;
  description_en: string;
  description_pl: string;
  link: url;
  image: url;
  document: url;
  categories: RuralEventCategoryId[];
  classification_l1: GoogleNaturalLanguageL1[];
  classification_l2: GoogleNaturalLanguageL2[];
  classification_l3: GoogleNaturalLanguageL3[];

  // date and time
  start: number;
  end: number;
  allday: boolean;
  occurrence: string;
  location: string;
  location_name: string;
  location_address: string;
  location_geo: string;
  scope: string;
  community_id: string;
  community_geo: string;
  community_name: string;
  municipality_id: string;
  county_id: string;
  state_id: string;
  country_id: string;
  organizer_id: string;
  organizer_name: string;
  calendar_id: string;
  created: number;
  changed: number;
  deleted: number;
}
