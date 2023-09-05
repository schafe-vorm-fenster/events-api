import { PostEventRequestBody } from "../events.types";
import { IndexedEvent } from "../search/types";
import { googleDatetimeToTimestamp } from "./datetime/googleDatetimeToTimestamp";
import { eventUuid } from "./uuids/eventUuid";

export const buildCancelledEvent = (
  rawEvent: PostEventRequestBody
): IndexedEvent => {
  const indexableEvent: any = {
    id: eventUuid(rawEvent),

    /**
     * systeme data
     */
    created: googleDatetimeToTimestamp(rawEvent?.created) || 0,
    changed: googleDatetimeToTimestamp(rawEvent?.updated) || 0,
    deleted:
      rawEvent?.status === "cancelled"
        ? googleDatetimeToTimestamp(rawEvent?.updated) || 0
        : 0,
  };

  return indexableEvent;
};
