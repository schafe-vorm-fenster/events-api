import { IndexedEvent } from "./types";

export interface GetEventResult {
  found: number;
  hit: IndexedEvent;
}
