import { getLogger } from "@/src/logging/logger";
import { ApiEvents } from "@/src/logging/loggerApps.config";
import { RuralEventCategoryId } from "@/packages/rural-event-types/src/rural-event-category.types";
import { RuralEventScope } from "@/packages/rural-event-types/src/rural-event-scope.types";
import { IndexedEvent } from "@/src/events/types/indexed-event.types";
import createHttpError from "http-errors";
import { getAfterFilter } from "./filters/get-after-filter";
import { getBeforeFilter } from "./filters/get-before-filter";
import { getCommunityFilter } from "./filters/get-community-filter";
import { getMunicipalityFilter } from "./filters/get-municipality-filter";
import { getScopeDistance } from "@/src/events/scopes/scope-distances";
import client from "./client";
import eventsSchema from "@/src/events/schema/typesense.schema";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import { ISO8601 } from "@/src/rest/iso8601.types";
import { Language } from "@/src/events/localization/types/languages.types";

export interface CommunityCenterQuery {
  geopoint: [number, number];
  communityId: string;
  municipalityId: string;
  countyId: string;
  stateId: string;
  countryId: string;
}

export interface SearchEventsQuery {
  center: CommunityCenterQuery;
  scope: RuralEventScope;
  containTighterScopes?: boolean;
  category?: RuralEventCategoryId;
  after?: ISO8601;
  before?: ISO8601;
  language?: Language;
}

// TODO: maybe use an existing type from typesense
export interface SearchEventsResult {
  found: number;
  page: number;
  out_of: number;
  hits: IndexedEvent[]; // TODO: refactor to search result event
}

export const searchEvents = async (
  query: SearchEventsQuery
): Promise<SearchEventsResult> => {
  const log = getLogger(ApiEvents.search);
  log.debug("query: ", query);

  // validate geo center
  if (
    !query.center ||
    !query.center.geopoint ||
    !query.center.communityId ||
    !query.center.municipalityId ||
    !query.center.countyId ||
    !query.center.stateId ||
    !query.center.countryId
  ) {
    throw createHttpError(
      400,
      "invalid center param, event search requires a valid center geopoint and geoname ids for all levels"
    );
  }

  // validate scope
  if (!query.scope || !RuralEventScope.parse(query.scope)) {
    throw createHttpError(
      400,
      "invalid scope param, event search requires a valid scope"
    );
  }

  // validate after
  let afterFilter: string | undefined = undefined;
  try {
    afterFilter = getAfterFilter(query.after);
  } catch (err: unknown) {
    throw createHttpError(
      400,
      (err as Error)?.message || "cannot build an after filter"
    );
  }

  // validate before
  let beforeFilter: string | undefined = undefined;
  try {
    beforeFilter = getBeforeFilter(query.before);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw createHttpError(400, err.message || "cannot build a before filter");
    }
    throw createHttpError(400, "cannot build a before filter");
  }

  // pre-define admin filters
  const communityFilter: string = getCommunityFilter(query.center.communityId);
  const municipalityFilter: string = getMunicipalityFilter(
    query.center.municipalityId
  );
  const countyFilter: string = `county.id: ${query.center.countyId} && scope: [county,state,country]`;
  const stateFilter: string = `state.id: ${query.center.stateId} && scope: [state,country]`;
  const countryFilter: string = `country.id: ${query.center.countryId} && scope: country`;

  // pre-define distance filters
  const nearbyFilter: string = `community.geopoint:(${
    query.center.geopoint[0]
  }, ${query.center.geopoint[1]}, ${getScopeDistance(
    "nearby"
  )} km) && scope: [nearby,region,county,state,country]`;
  const regionFilter: string = `community.geopoint:(${
    query.center.geopoint[0]
  }, ${query.center.geopoint[1]}, ${getScopeDistance(
    "region"
  )} km) && scope: [region,county,state,country]`;

  /**
   * generate geo distance query filters incl. aggregation levels if containTighterScopes is set
   *
   * community
   *  - radius:community with scope:community
   *
   * municipality: contains community plus
   *  - radius:municipality with scope:municipality
   *
   * nearby:
   *  - radius:nearby with scope:nearby
   *  - radius:community with scope:community
   *  - radius:municipality with scope:municipality
   *
   * region: should contain all from nearby plus
   *  - radius:region with scope:region
   *
   * county, state, country ...
   *  - radius:county with scope:county
   *  - radius:state with scope:state
   */
  const scopeBasedFilters: string[] = [];
  switch (query.scope) {
    case "community":
      scopeBasedFilters.push(communityFilter);
      break;
    case "municipality":
      scopeBasedFilters.push(municipalityFilter);
      if (query.containTighterScopes) {
        scopeBasedFilters.push(communityFilter);
      }
      break;
    case "nearby":
      scopeBasedFilters.push(nearbyFilter);
      if (query.containTighterScopes) {
        scopeBasedFilters.push(communityFilter);
        scopeBasedFilters.push(municipalityFilter);
      }
      break;
    case "region":
      scopeBasedFilters.push(regionFilter);
      if (query.containTighterScopes) {
        scopeBasedFilters.push(nearbyFilter);
        scopeBasedFilters.push(communityFilter);
        scopeBasedFilters.push(municipalityFilter);
      }
      break;
    case "county":
      scopeBasedFilters.push(countyFilter);
      if (query.containTighterScopes) {
        scopeBasedFilters.push(regionFilter);
        scopeBasedFilters.push(nearbyFilter);
        scopeBasedFilters.push(communityFilter);
        scopeBasedFilters.push(municipalityFilter);
      }
      break;
    case "state":
      scopeBasedFilters.push(stateFilter);
      if (query.containTighterScopes) {
        scopeBasedFilters.push(countyFilter);
        scopeBasedFilters.push(regionFilter);
        scopeBasedFilters.push(nearbyFilter);
        scopeBasedFilters.push(communityFilter);
        scopeBasedFilters.push(municipalityFilter);
      }
      break;
    case "country":
      scopeBasedFilters.push(countryFilter);
      if (query.containTighterScopes) {
        scopeBasedFilters.push(stateFilter);
        scopeBasedFilters.push(countyFilter);
        scopeBasedFilters.push(regionFilter);
        scopeBasedFilters.push(nearbyFilter);
        scopeBasedFilters.push(communityFilter);
        scopeBasedFilters.push(municipalityFilter);
      }
      break;
    default:
      throw createHttpError(400, "invalid scope");
  }

  log.debug("scopeBasedFilters", scopeBasedFilters);

  /**
   * generate category filter
   */
  const categoryFilter: string | undefined = query.category
    ? `categories: ${query.category}`
    : undefined;

  /**
   * build locale based exclude fields
   */
  let localizedExcludeFields: string = "";

  switch (query?.language as string) {
    case "de":
      localizedExcludeFields =
        "summary.en, summary.pl, summary.uk, summary.ru, description.en, description.pl, description.uk, description.ru";
      break;
    case "en":
      localizedExcludeFields =
        "summary.de, summary.pl, summary.uk, summary.ru, description.de, description.pl, description.uk, description.ru";
      break;
    case "pl":
      localizedExcludeFields =
        "summary.de, summary.en, summary.uk, summary.ru, description.de, description.en, description.uk, description.ru";
      break;
    case "uk":
      localizedExcludeFields =
        "summary.de, summary.en, summary.pl, summary.ru, description.de, description.en, description.pl, description.ru";
      break;
    case "ru":
      localizedExcludeFields =
        "summary.de, summary.en, summary.pl, summary.uk, description.de, description.en, description.pl, description.uk";
      break;
    default:
      localizedExcludeFields = "";
      break;
  }

  const searchParameters = {
    q: "*",
    filter_by:
      scopeBasedFilters.map((f) => `(${f})`).join(" || ") +
      (categoryFilter ? ` && (${categoryFilter})` : "") +
      (afterFilter ? ` && (${afterFilter})` : "") +
      (beforeFilter ? ` && (${beforeFilter})` : ""),

    facet_by: "categories,occurrence,scope", // TODO: check facets, maybe add more?
    sort_by: "start:asc",
    exclude_fields: localizedExcludeFields,
    per_page: 100,
    limit_hits: 100,
  };

  log.debug(searchParameters, "searchParameters");

  // TODO: maybe put into one generic function? Only for error handling reasons?
  const result = await client
    .collections(eventsSchema.name)
    .documents()
    .search(searchParameters)
    .then(function (searchResults) {
      log.debug(`Found ${searchResults.found} events`);
      return {
        found: searchResults.found,
        page: searchResults.page,
        out_of: searchResults.out_of,
        hits: searchResults.hits?.map((hit) => hit.document) || [],
      } as SearchEventsResult;
    })
    .catch((error: TypesenseError | unknown) => {
      let httpCode: number | undefined;
      if (error instanceof TypesenseError) httpCode = error?.httpStatus;
      throw createHttpError(
        httpCode || 500,
        (error as TypesenseError | Error)?.message ||
          "Error while searching for events"
      );
    });
  return result;
};
