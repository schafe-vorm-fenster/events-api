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

  // TODO: refactor using zod

  let errors: string[] = new Array();
  const event: any = json as Schema$Event;

  // check "json" if it contains all required properties
  requiredProperties.forEach((property: Property) => {
    if (!event[property.key]) errors.push(`missing ${property.key}`);
    if (property.value && event[property.key] !== property.value)
      errors.push(`invalid ${property.key}`);
  });

  const explanation: string = `The following properties are required: ${requiredProperties
    .map((property: Property) => property.key)
    .join(", ")}`;

  const errorMessage: string = `${errors.join(", ")}. ${explanation}.`;
  if (errors.length > 0) throw new Error(errorMessage);
  return true;
};
