import { LanguageList } from "@/src/languages/languages.types";
import { ResultSchema } from "@/src/rest/result.schema";
import { z } from "zod";

export const LanguagesSuccessfulSchema = ResultSchema.extend({
  data: LanguageList,
});
