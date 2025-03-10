import { initContract } from "@ts-rest/core";
import { CategoriesSuccessfulSchema } from "./categories.schema";
import { z } from "zod";
import { Locale } from "@/src/events/localization/types/languages.types";
const c = initContract();

export const CategoriesContract = c.router({
  getCategories: {
    method: "GET",
    path: "/api/categories",
    // add query param for "lang" to filter by language
    query: z.object({
      lang: Locale.optional().describe("Language code to filter descriptions."),
      examples: z
        .enum(["true", "false"])
        .transform((val) => {
          if (val === "false") {
            return false;
          }
          if (val === "true") {
            return true;
          }
          return true;
        })
        .optional(),
    }),
    responses: {
      200: CategoriesSuccessfulSchema,
    },
    headers: z.object({
      "Sheep-Token": z.string().optional(),
    }),
    summary:
      "Returns a list of categories supported by the app incl. all locales.",
    description:
      "Returns a list of categories supported by the app incl. all locales.",
  },
});
