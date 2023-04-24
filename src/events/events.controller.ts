import createHttpError from "http-errors";
import {
  Get,
  Path,
  Post,
  Query,
  Route,
  Response,
  SuccessResponse,
  Tags,
  Body,
} from "tsoa";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import { RuralEventCategory } from "../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import {
  AllRuralEventScopes,
  isRuralEventScope,
  RuralEventScope,
} from "../../packages/rural-event-types/src/ruralEventScopes";
import { classifyContent } from "./classify/classifyContent";
import { getMetadataFromContent } from "./classify/getMetadataFromContent";
import {
  EventClassification,
  EventContentWithMetadata,
  PostEventRequestBody,
} from "./events.types";
import { geoCodeLocation } from "./geocode/geoCodeLocation";
import { isValidGeonameId } from "./geocode/helpers/isValidGeonameId";
import { GeoLocation } from "./geocode/types/GeoLocation";
import { buildIndexableEvent } from "./helpers/buildIndexableEvent";
import { isValidGoogleEvent } from "./helpers/json/isValidGoogleEvent";
import { isValidJson } from "./helpers/json/isValidJson";
import { mapScopes } from "./scopes/mapScopes";
import client from "./search/client";
import eventsSchema from "./search/schema";
import { searchEvents, SearchEventsResult } from "./search/searchEvents";
import { IndexedEvent } from "./search/types";
import {
  translateContent,
  TranslatedContent,
} from "./translate/translateContent";

type ScopeFilter = RuralEventScope | undefined;
type CategoryFilter = RuralEventCategory | undefined;

interface EventsResponse {
  name: string;
}

@Route("events")
@Tags("Events")
export default class EventsController {
  /**
   * Returns a list of events for a given community.
   * @param community Geonames.org id of the community, e.g. "geoname-2838887".
   * @param scope Scope to filter events by, values see RuralEventScope. If no value is provided, all scopes are returned.
   * @param category Category to filter events by, values see RuralEventCategory. If no value is provided, all categories are returned.
   */
  @Get("{community}/{scope}/{category}")
  @SuccessResponse("200", "Okay")
  @Response("204", "No Events")
  @Response("400", "Invalid Parameters")
  public async getEventsForCommunityFilteredByScopeAndCategory(
    @Path() community: string,
    @Path() scope: string,
    @Path() category: string,
    @Query() days?: number
  ): Promise<EventsResponse> {
    if (!isValidGeonameId(community))
      throw createHttpError(
        400,
        "community id is required and must match the pattern 'geoname.1234567'"
      );

    return { name: "jan" };
  }

  /**
   * Returns a list of events for a given community.
   * @param community Geonames.org id of the community, e.g. "geoname-2838887".
   * @param scope Scope to filter events by, values see RuralEventScope. If no value is provided, all scopes are returned.
   * @param days Number of days to look ahead for events. If no value is provided, 30 days will be used.
   */
  @Get("{community}/{scope}")
  @SuccessResponse("200", "Okay")
  @Response("204", "No Events")
  @Response("400", "Invalid Parameters")
  public async getEventsForCommunityFilteredByScope(
    @Path() community: string,
    @Path() scope: string,
    @Query() days?: number
  ): Promise<SearchEventsResult> {
    // check community parameter
    if (!isValidGeonameId(community))
      throw createHttpError(
        400,
        "community id is required and must match the pattern 'geoname.1234567'"
      );

    // check scope parameter
    if (!scope || !isRuralEventScope(scope)) {
      throw createHttpError(
        400,
        "scope is not a valid rural scope, has to be one of [" +
          AllRuralEventScopes.join("|") +
          "]"
      );
    }

    // TODO: get geopoint, geonamesId and municipalityId for given community from geo-api
    const center: [number, number] = [53.9206, 13.5802];
    const communityId: string = "geoname.2838887";
    const municipalityId: string = "geoname.6548320";
    const countyId: string = "geoname.8648415";
    const stateId: string = "geoname.2872567";
    const countryId: string = "geoname.2921044";

    return await searchEvents({
      center: {
        geopoint: center,
        communityId: communityId,
        municipalityId: municipalityId,
        countyId: countyId,
        stateId: stateId,
        countryId: countryId,
      },
      scope: scope as RuralEventScope,
      containTighterScopes: true,
      // category: "culture-tourism", TODO: use if query contains a category filter path segment
    })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw createHttpError(
          error.httpStatus || 500,
          error.message || "Error while searching for events"
        );
      });
  }

  /**
   * Returns a list of events for a given community.
   * @param community Geonames.org id of the community, e.g. "geoname-2838887".
   * @param days Number of days to look ahead for events. If no value is provided, 30 days will be used.
   */
  @Get("{community}")
  @SuccessResponse("200", "Okay")
  @Response("204", "No Events")
  @Response("400", "Invalid Parameters")
  public async getEventsForCommunity(
    @Path() community: string,
    @Query() days?: number
  ): Promise<EventsResponse> {
    if (!community) {
      throw new Error("Community is required");
    }
    // check, if parameter "community" matches the pattern "geoname-1234567"
    if (!community.match(/^geoname-\d+$/)) {
      throw new Error("Community must match the pattern 'geoname-1234567'");
    }

    return { name: "jan" };
  }

  /**
   * Returns a list of all events. TODO: remove this method in production.
   * @param community Geonames.org id of the community, e.g. "geoname-2838887".
   * @param days Number of days to look ahead for events. If no value is provided, 30 days will be used.
   */
  @Get("/")
  @SuccessResponse("200", "Okay")
  @Response("204", "No Events")
  @Response("400", "Invalid Parameters")
  public async getAllEvents(): Promise<any> {
    const searchParameters = {
      q: "*",
      query_by: "summary.de",
      sort_by: "start:desc",
      facet_by: "categories,occurrence,scope",
      exclude_fields: "description.en, description.pl, summary.en, summary.pl",
      per_page: 100,
      limit_hits: 100,
    };

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
  }

  /**
   * Creates or updates an event.
   */
  @Post("")
  @SuccessResponse(201, "Created") // TODO: use proper type
  @Response<any>(200, "Updated") // TODO: use proper type
  @Response<Error>(422, "Unprocessable Entity")
  public async createEvent(
    @Body() eventObject: PostEventRequestBody
  ): Promise<any> {
    if (!isValidJson(eventObject))
      throw createHttpError(422, "request json is not valid");

    try {
      isValidGoogleEvent(eventObject);
    } catch {
      throw createHttpError(422, "request json is not valid");
    }

    // enhance event data
    let geolocation: GeoLocation;
    let metadata: EventContentWithMetadata | null;
    let scope: RuralEventScope;
    let classification: EventClassification | null;
    let translatedContent: TranslatedContent | null;

    try {
      // create uuid based on the event data
      metadata = getMetadataFromContent(eventObject?.description as string); // data needed in the next steps

      // do in parallel to save time
      [geolocation, scope, classification, translatedContent] =
        await Promise.all([
          geoCodeLocation(eventObject?.location as string),
          mapScopes(metadata?.scopes as string[]),
          classifyContent(
            metadata?.tags as string[],
            eventObject.summary as string,
            eventObject.description as string
          ),
          translateContent(
            eventObject.summary as string,
            eventObject.description as string
          ),
        ]);

      // TODO: fetch detailled geo data for community --- or not??
    } catch (error: any) {
      throw createHttpError(
        422,
        "could not process event data: " + error.message
      );
    }

    // TODO: build proper indexable object
    const newEvent: IndexedEvent = await buildIndexableEvent(
      eventObject,
      geolocation,
      metadata,
      scope,
      classification,
      translatedContent
    );

    return await client
      .collections("events")
      .documents()
      .create(newEvent)
      .then(
        (data: any) => {
          console.debug("data: ", data);
          return data;
        },
        (err: TypesenseError) => {
          throw err as TypesenseError;
        }
      )
      .catch((error: TypesenseError) => {
        // if error is an already exists
        if (error.httpStatus === 400) {
          return client
            .collections("events")
            .documents(newEvent.id)
            .update(newEvent)
            .then(
              (data: any) => {
                console.debug("data: ", data);
                return data;
              },
              (err: TypesenseError) => {
                console.error(err);
                throw createHttpError(
                  err.httpStatus || 500,
                  err.message ||
                    "could not create or update event without known reason"
                );
              }
            );
        } else {
          throw createHttpError(
            500,
            "could not create or update event without known reason"
          );
        }
      });
  }
}
