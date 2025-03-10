import { IndexedEvent } from "@/src/events/types/indexed-event.types";

export interface GetEventResult {
  found: number;
  hit: IndexedEvent;
}
