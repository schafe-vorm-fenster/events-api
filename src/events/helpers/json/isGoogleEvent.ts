import { calendar_v3 } from "@googleapis/calendar";
import Schema$Event = calendar_v3.Schema$Event;
import { isValidJson } from "./isValidJson";

interface Property {
  key: string;
  value?: any;
}

const requiredProperties: Property[] = [
  { key: "id" },
  { key: "kind", value: "calendar#event" },
  { key: "start" },
];

/**
 * Check if the input is a google event.
 * @param obj: any
 * @returns boolean
 */
export const isGoogleEvent = (json: object): boolean => {
  if (!isValidJson(json)) throw new Error("Request body is no valid json.");

  let errors: string[] = new Array();
  const event: any = json as Schema$Event;

  // check "json" if it contains all required properties
  requiredProperties.forEach((property: Property) => {
    if (!event[property.key]) errors.push(`missing ${property.key}`);
    if (property.value && event[property.key] !== property.value)
      errors.push(`invalid ${property.key}`);
  });

  const errorMessage: string = `Request json is not a valid google event object: ${errors.join(
    ", "
  )}.`;
  if (errors.length > 0) throw new Error(errorMessage);
  return true;
};
