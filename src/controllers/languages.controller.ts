import { Get, Route } from "tsoa";
import { SvfLanguage, svfLocales } from "../../settings/languages";

export type LanguagesResponse = ReadonlyArray<SvfLanguage>;

@Route("languages")
export default class LanguagesController {
  @Get("/")
  public async getLanguages(): Promise<LanguagesResponse> {
    return svfLocales;
  }
}
