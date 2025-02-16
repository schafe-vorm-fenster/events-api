import { createNextHandler } from "@ts-rest/serverless/next";
import { LanguagesContract } from "./languages.contract";
import { getLogger } from "@/logging/logger";
import { api } from "@/logging/loggerApps.config";
import { LanguageList } from "@/src/languages/languages.types";
import { svfLocales } from "@/src/languages/languages.config";
import { ConfigCacheControlHeader } from "@/src/config/ConfigCacheControlHeader";

const log = getLogger(api.languages.get);

const handler = createNextHandler(
  LanguagesContract,
  {
    getLanguages: async ({ query }, res) => {
      const lang: string | undefined = query?.lang ?? undefined;
      log.info({ lang }, `get languages`);

      // copy languages to avoid mutation
      let languages: LanguageList = JSON.parse(JSON.stringify(svfLocales));

      // filter localizations by given language on locale
      languages.map((language) => {
        if (lang) {
          language.localizations = language.localizations.filter(
            (localization) => Object.keys(localization)[0] === lang
          );
        }
        return language;
      });

      res.responseHeaders.set("Cache-Control", ConfigCacheControlHeader);

      return {
        status: 200,
        body: {
          status: 200,
          results: languages.length,
          timestamp: new Date().toISOString(),
          data: languages,
        },
      };
    },
  },
  {
    handlerType: "app-router",
  }
);

export { handler as GET };
