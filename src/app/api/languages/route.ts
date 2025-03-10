import { createNextHandler } from "@ts-rest/serverless/next";
import { LanguagesContract } from "./languages.contract";
import { getLogger } from "@/logging/logger";
import { ConfigCacheControlHeader } from "@/src/config/ConfigCacheControlHeader";
import { Language } from "@/src/events/localization/types/languages.types";
import { apiLogger } from "@/logging/loggerApps.config";
import { LanguageList } from "./languages.schema";
import { getLanguageName } from "@/src/events/localization/helpers/get-lanuage-name";
import { handleZodError } from "@/src/rest/zod-error-handler";

const log = getLogger(apiLogger.languages.get);

const handler = createNextHandler(
  LanguagesContract,
  {
    getLanguages: async ({ query }, res) => {
      const lang: Language = query?.language ?? "de";
      log.info({ lang }, `get languages`);

      const languageList: LanguageList = {
        de: getLanguageName("de", lang),
        en: getLanguageName("en", lang),
        pl: getLanguageName("pl", lang),
        uk: getLanguageName("uk", lang),
        ru: getLanguageName("ru", lang),
      };

      res.responseHeaders.set("Cache-Control", ConfigCacheControlHeader);

      return {
        status: 200,
        body: {
          status: 200,
          timestamp: new Date().toISOString(),
          data: languageList,
        },
      };
    },
  },
  {
    jsonQuery: true,
    responseValidation: true,
    handlerType: "app-router",
    errorHandler: handleZodError,
  }
);

export { handler as GET };
