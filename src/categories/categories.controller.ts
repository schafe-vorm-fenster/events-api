import { Get, Route, Tags } from "tsoa";
import { ruralEventCategories } from "../../packages/rural-event-categories/src/types/ruralEventCategory";
import { RuralEventCategory } from "../../packages/rural-event-categories/src/types/ruralEventCategory.types";

export type CategoriesResponse = ReadonlyArray<RuralEventCategory>;

@Route("categories")
@Tags("Constants")
export default class CategoriesController {
  /**
   * Returns a list of categories supported by the app incl. all locales.
   */
  @Get("/")
  public async getCategories(): Promise<CategoriesResponse> {
    return ruralEventCategories;
  }
}
