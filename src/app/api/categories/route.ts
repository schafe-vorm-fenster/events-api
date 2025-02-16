import { createNextHandler } from "@ts-rest/serverless/next";
import { CategoriesContract } from "./categories.contract";
import { getLogger } from "@/logging/logger";
import { api } from "@/logging/loggerApps.config";
import { ruralEventCategories } from "@/packages/rural-event-categories/src/types/ruralEventCategory";
import { RuralEventCategoryList } from "@/packages/rural-event-categories/src/types/ruralEventCategory.types";
import { ConfigCacheControlHeader } from "@/src/config/ConfigCacheControlHeader";

const log = getLogger(api.categories.get);

const handler = createNextHandler(
  CategoriesContract,
  {
    getCategories: async ({ query }, res) => {
      const lang: string | undefined = query?.lang ?? undefined;
      const examples: boolean | undefined = query?.examples ?? undefined;

      log.info({ lang, examples }, `get categories`);

      // copy categories to avoid mutation
      let categories: RuralEventCategoryList = JSON.parse(
        JSON.stringify(ruralEventCategories)
      );

      // filter localizations by given language on locale
      // remove examples if not requested
      categories.map((category) => {
        if (lang) {
          category.localizations = category.localizations.filter(
            (localization) => localization.locale === lang
          );
        }
        if (examples !== true) {
          category.localizations = category.localizations.map(
            (localization) => {
              delete localization.examples;
              return localization;
            }
          );
        }
        return category;
      });

      res.responseHeaders.set("Cache-Control", ConfigCacheControlHeader);

      return {
        status: 200,
        body: {
          status: 200,
          results: categories.length,
          timestamp: new Date().toISOString(),
          data: categories,
        },
      };
    },
  },
  {
    handlerType: "app-router",
  }
);

export { handler as GET };
