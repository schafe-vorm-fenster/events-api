import { Get, Route } from "tsoa";
import { ruralEventCategories } from "../../packages/rural-event-categories/src/ruralEventCategory";
import { RuralEventCategory } from "../../packages/rural-event-categories/src/ruralEventCategoryTypes";

export type CategoriesResponse = ReadonlyArray<RuralEventCategory>;

@Route("categories")
export default class CategoriesController {
  @Get("/")
  public async getCategories(): Promise<CategoriesResponse> {
    return ruralEventCategories;
  }
}
