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
import getUuidByString from "uuid-by-string";
import { RuralEventCategory } from "../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import { RuralEventScope } from "../../packages/rural-event-types/src/ruralEventScopes";
import { classifyContent } from "./classify/classifyContent";
import { getMetadataFromContent } from "./classify/getMetadataFromContent";
import { mockEventCommunity } from "./events.mock";
import {
  EventClassification,
  EventMetadata,
  PostEventRequestBody,
} from "./events.types";
import { geoCodeLocation } from "./geocode/geoCodeLocation";
import { GeoLocation } from "./geocode/types/GeoLocation";
import { buildIndexableEvent } from "./helpers/buildIndexableEvent";
import { checkIfJsonObject } from "./helpers/checkIfJsonObject";
import { getUniqueIdStringForEvent } from "./helpers/getUniqueIdStringForEvent";
import { validateEventJsonObject } from "./helpers/validateEventJsonObject";
import { mapScopes } from "./scopes/mapScopes";
import client from "./search/client";
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
   * Returns a list of events for a given community.
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
    };

    const result: any = await client
      .collections("events")
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

  @Post("/") // TODO: maybe let the app set the id to ensure uniqueness?
  @SuccessResponse("201", "Created")
  @Response<Error>(422, "Unprocessable Entity")
  public async createEvent(
    @Body() eventObject: PostEventRequestBody
  ): Promise<any> {
    try {
      // check incoming data
      checkIfJsonObject(eventObject);
      validateEventJsonObject(eventObject);
    } catch (error: any) {
      throw createHttpError(422, "request data is not valid: " + error.message);
    }

    // enhance event data
    let uuid: string;
    let geolocation: GeoLocation;
    let metadata: EventMetadata | null;
    let scope: RuralEventScope;
    let classification: EventClassification | null;
    let translatedContent: TranslatedContent | null;

    try {
      // create uuid based on the event data
      uuid = getUuidByString(getUniqueIdStringForEvent(eventObject)); // low runtime
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
    } catch (error: any) {
      throw createHttpError(
        422,
        "could not process event data: " + error.message
      );
    }

    // TODO: build proper inexable object
    const newEvent: IndexedEvent = await buildIndexableEvent(
      eventObject,
      uuid,
      geolocation,
      metadata,
      scope,
      classification,
      translatedContent
    );

    const result: any = await client
      .collections("events")
      .documents()
      .create(newEvent)
      .then(
        (data: any) => {
          return data;
        },
        (err: any) => {
          return err;
        }
      );

    return {
      name: "CREATE",
      newEvent: newEvent,
      uuid: uuid,
      scope: scope,
      classification: classification,
      translations: translatedContent,
      meta: metadata || {},
      geo: geolocation,
      request: result,
    };
  }
}
