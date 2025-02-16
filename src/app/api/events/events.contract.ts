import { initContract } from "@ts-rest/core";
import { AddEventsContract } from "./add-events.contract";
import { DeleteEventContract } from "./[id]/delete-event.contract";
import { GetEventsContract } from "./get-events.contract";
import { GetEventContract } from "./[id]/get-event.contract";

const c = initContract();

// object merge AddEventsContract, DeleteEventContract,
export const EventsContract = c.router({
  ...GetEventsContract,
  ...GetEventContract,
  ...AddEventsContract,
  ...DeleteEventContract,
});
