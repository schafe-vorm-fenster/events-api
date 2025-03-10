import { createNextHandler } from "@ts-rest/serverless/next";
import { SearchEventsByCommunityContract } from "./search-events-by-community.contract";
import { getLogger } from "@/logging/logger";
import { apiLogger } from "@/logging/loggerApps.config";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { SearchEventsSuccessfulSchema } from "./search-events.schema";
import {
  CommunityCenterQuery,
  searchEvents,
} from "@/src/clients/typesense/search/searchEvents";
import { getCommunityCenter } from "@/src/clients/typesense/search/helpers/get-community-center";
import { extractGeonameId } from "@/src/clients/geo-api/helpers/extract-geoname-id";
import { ISO8601 } from "@/src/rest/iso8601.types";
import { GeonameId } from "@/src/events/types/geonames.types";
import { HttpError } from "http-errors";
import { Language } from "@/src/events/localization/types/languages.types";
import { MinimalCacheControlHeader } from "@/src/config/MinimalCacheControlHeader";

const log = getLogger(apiLogger.events.search);

const handler = createNextHandler(
  SearchEventsByCommunityContract,
  {
    "search-events-by-community": async ({ params, query }, res) => {
      const community: GeonameId = params?.community ?? "";
      const before: ISO8601 | undefined = query?.before ?? undefined;
      const after: ISO8601 | undefined = query?.after ?? undefined;
      const language: Language = query?.language ?? "de";

      log.info(
        { community, before, after, language },
        `search events by community`
      );

      const timestamp = new Date().toISOString();

      // get community details to configure scoped search
      const communityCenter: CommunityCenterQuery = await getCommunityCenter(
        extractGeonameId(community)
      );

      // Set cache control header
      res.responseHeaders.set("Cache-Control", MinimalCacheControlHeader);

      return await searchEvents({
        center: communityCenter,
        scope: "region", // TODO: check which should be the default scope if not set
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
