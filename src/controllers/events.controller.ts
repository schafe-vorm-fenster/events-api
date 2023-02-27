import { Get, Path, Query, Route, Tags } from "tsoa";
import { RuralEventCategory } from "../../packages/rural-event-categories/src/ruralEventCategoryTypes";
import { RuralEventScope } from "../../packages/rural-event-types/dist/ruralEventTypes";

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
}
