import createHttpError from "http-errors";
import { RuralEventCategoryId } from "../../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import {
  isRuralEventScope,
  RuralEventScope,
} from "../../../packages/rural-event-types/src/ruralEventScopes";
import { getScopeDistance } from "../scopes/scopeDistances";
import client from "./client";
import { getCommunityFilter } from "./filters/getCommunityFilter";
import { getMunicipalityFilter } from "./filters/getMunicipalityFilter";
import eventsSchema from "./schema";
import { IndexedEvent } from "./types";

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
}

// TODO: maybe use an existing type from typesense
export interface SearchEventsResult {
  found: number;
  page: number;
  out_of: number;
  hits: IndexedEvent[];
}

export const searchEvents = async (
  query: SearchEventsQuery
): Promise<SearchEventsResult> => {
  console.log("query: ", query);

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
  if (!query.scope || !isRuralEventScope(query.scope)) {
    throw createHttpError(
      400,
      "invalid scope param, event search requires a valid scope"
    );
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
  let scopeBasedFilters: string[] = [];
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

  console.log("scopeBasedFilters", scopeBasedFilters);

  /**
   * generate category filter
   */
  const categoryFilter: string | undefined = query.category
    ? `categories: ${query.category}`
    : undefined;

  const searchParameters = {
    q: "*",
    filter_by:
      scopeBasedFilters.map((f) => `(${f})`).join(" || ") +
      (categoryFilter ? ` && (${categoryFilter})` : ""),
    facet_by: "categories,occurrence,scope",
    sort_by: "start:desc",
    exclude_fields: "description.en, description.pl, summary.en, summary.pl",
    per_page: 100,
    limit_hits: 100,
  };

  console.log("searchParameters: ", searchParameters);

  // TODO: put into one generic function?
  const result: any = await client
    .collections(eventsSchema.name)
    .documents()
    .search(searchParameters)
    .then(
      function (searchResults: any) {
        return searchResults;
      },
      (err: any) => {
        return err;
      }
    );
  return result;
};
