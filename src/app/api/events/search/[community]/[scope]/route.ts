import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/logging/logger";
import { apiLogger } from "@/logging/loggerApps.config";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { SearchEventsByCommunityScopeContract } from "./search-events-by-community-scope.contract";
import { SearchEventsSuccessfulSchema } from "../search-events.schema";
import { ISO8601 } from "@/src/rest/iso8601.types";
import { Language } from "@/src/events/localization/types/languages.types";
import { GeonameId } from "@/src/events/types/geonames.types";
import { RuralEventScope } from "@/packages/rural-event-types/src/rural-event-scope.types";
import { HttpError } from "http-errors";
import {
  CommunityCenterQuery,
  searchEvents,
} from "@/src/clients/typesense/search/searchEvents";
import { extractGeonameId } from "@/src/clients/geo-api/helpers/extract-geoname-id";
import { getCommunityCenter } from "@/src/clients/typesense/search/helpers/get-community-center";
import { getDataCacheControlHeader } from "@/src/config/cache-control-header";

const log = getLogger(apiLogger.events.search);

const handler = createNextHandler(
  SearchEventsByCommunityScopeContract,
  {
    "search-events-by-community-scope": async ({ params, query }, res) => {
      const community: GeonameId = params?.community ?? "";
      const scope: RuralEventScope = params?.scope ?? "";
      const before: ISO8601 | undefined =
        (query?.before as ISO8601) ?? undefined;
      const after: ISO8601 | undefined = (query?.after as ISO8601) ?? undefined;
      const language: Language = (query?.language as Language) ?? "de";

      log.info(
        { community, scope, before, after, language },
        `search events by community`
      );
      const timestamp = new Date().toISOString();

      // get community details to configure scoped search
      const communityCenter: CommunityCenterQuery = await getCommunityCenter(
        extractGeonameId(community)
      );

      // Set cache control header
      res.responseHeaders.set("Cache-Control", getDataCacheControlHeader());

      return await searchEvents({
        center: communityCenter,
        scope: scope,
        containTighterScopes: true,
        after: after,
        before: before,
        language: language,
      })
        .then((result) => {
          // return res
          //   .status(200)
          //   .setHeader("Cache-Control", CacheControlHeader)
          //   .json(result);

          return {
            status: 200 as const,
            body: {
              status: 200,
              results: result.found,
              timestamp: timestamp,
              data: result.hits,
            } as SearchEventsSuccessfulSchema,
          };
        })
        .catch((error: HttpError | unknown) => {
          let httpCode: number | undefined;
          if (error instanceof HttpError) httpCode = error?.status;
          return {
            status: 500 as const,
            body: {
              status: httpCode ?? 500,
              error: error ?? "Internal Server Error",
            } as ErrorSchema,
          };
        });
    },
  },
  {
    jsonQuery: true,
    responseValidation: false, // TODO: Check why it fails
    handlerType: "app-router",
    errorHandler: handleZodError,
  }
);

export { handler as GET };
