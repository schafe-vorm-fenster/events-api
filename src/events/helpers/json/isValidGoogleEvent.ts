import { calendar_v3 } from "@googleapis/calendar";
import Schema$Event = calendar_v3.Schema$Event;
import { isValidJson } from "./isValidJson";

interface Property {
  key: string;
  value?: unknown;
}
// TODO: add empty field checks by zod
const requiredProperties: Property[] = [
  { key: "id" },
  { key: "kind", value: "calendar#event" },
  { key: "summary" },
  { key: "start" },
  { key: "location" },
];

/**
 * Check if the input is a valid json object.
 * @param obj: any
 * @returns boolean
 */
export const isValidGoogleEvent = (json: object): boolean => {
  if (!isValidJson(json)) return false;

  const failedChecks: string[] = [];
  const event: Schema$Event = json as Schema$Event;

  // check "json" if it contains all required properties
  requiredProperties.forEach((property: Property) => {
    if (!(property.key in event))
      failedChecks.push(`${property.key} not existing`);
    if (
      property.value &&
      property.key in event &&
      event[property.key as keyof Schema$Event] !== property.value
    )
      failedChecks.push(`${property.key} not matching ${property.value}`);
  });

  return failedChecks.length === 0;
};
