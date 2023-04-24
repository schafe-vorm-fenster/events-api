import { calendar_v3 } from "@googleapis/calendar";
import Schema$Event = calendar_v3.Schema$Event;
import { isValidJson } from "./isValidJson";

/**
 * Check if the input is a valid json object.
 * @param obj: any
 * @returns boolean
 */
export const isValidGoogleEvent = (json: object): boolean => {
  if (!isValidJson(json)) return false;

  // TODO: refactor using zod

  let errors: string[] = new Array();
  const event: Schema$Event = json as Schema$Event;

  if (!event.id) errors.push("missing id");
  if (!event.kind) errors.push("missing kind");
  if (event.kind !== "calendar#event") errors.push("invalid kind");
  if (!event.summary || event.summary.trim().length === 0)
    errors.push("missing summary");
  if (!event.start?.date && !event.start?.dateTime)
    errors.push("missing start date");
  if (!event.location || event.location.trim().length === 0)
    errors.push("missing location");

  if (errors.length > 0) throw new Error(errors.join(", "));
  return true;
};
