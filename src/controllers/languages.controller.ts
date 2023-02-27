import { Get, Route, Tags } from "tsoa";
import { SvfLanguage, svfLocales } from "../../settings/languages";

export type LanguagesResponse = ReadonlyArray<SvfLanguage>;

@Route("languages")
@Tags("Constants")
export default class LanguagesController {
  /**
   * Returns a list of languages supported by the app incl. all locales.
   */
  @Get("/")
  public async getLanguages(): Promise<LanguagesResponse> {
    return svfLocales;
  }
}
