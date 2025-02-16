import { initContract } from "@ts-rest/core";
import { HealthContract } from "./health/health.contract";
import { CategoriesContract } from "./categories/categories.contract";
import { LanguagesContract } from "./languages/languages.contract";
import { EventsContract } from "./events/events.contract";

const c = initContract();

export const ApiContract = c.router({
  health: HealthContract,
  categories: CategoriesContract,
  languages: LanguagesContract,
  events: EventsContract,
});
