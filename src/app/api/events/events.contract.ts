import { initContract } from "@ts-rest/core";
import { AddEventsToQueueContract } from "./bulk/add-events-to-queue.contract";
import { AddEventContract } from "./add-event.contract";
import { SingleEventContract } from "./[id]/single-event.contract";

const c = initContract();

// object merge AddEventsContract, DeleteEventContract,
export const EventsContract = c.router({
  ...SingleEventContract,
  ...AddEventsToQueueContract,
  ...AddEventContract,
});
