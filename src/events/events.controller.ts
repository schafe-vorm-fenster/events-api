import {
  Get,
  Path,
  Post,
  Query,
  Route,
  Response,
  SuccessResponse,
  Tags,
} from "tsoa";
import { RuralEventCategory } from "../../packages/rural-event-categories/src/types/ruralEventCategoryTypes";
import { RuralEventScope } from "../../packages/rural-event-types/dist/ruralEventTypes";
import { mockEventCommunity } from "./events.mock";
import client from "./search/client";
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

  @Post("{id}") // TODO: maybe let the app set th id to ensure uniqueness?
  @SuccessResponse("201", "Created")
  @Response<Error>(401, "Unauthorized")
  @Response<Error>(422, "Validation Failed")
  public async createEvent(
    @Path() id: string
    // @Body() requestBody: string
  ): Promise<any> {
    const result: any = await client
      .collections("events")
      .documents()
      .create(mockEventCommunity)
      .then(
        (data: any) => {
          return data;
        },
        (err: any) => {
          return err;
        }
      );

    return { name: "CREATE", debug: result };
  }
}