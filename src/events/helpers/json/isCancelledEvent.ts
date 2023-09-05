import { calendar_v3 } from "@googleapis/calendar";
import Schema$Event = calendar_v3.Schema$Event;

interface Property {
  key: string;
  value?: any;
}

const requiredProperties: Property[] = [
  { key: "id" },
  { key: "kind", value: "calendar#event" },
  { key: "status", value: "cancelled" },
  { key: "updated" },
];

/**
 * Check if the input is a cancelled google event.
 * @param obj: any
 * @returns boolean
 */
export const isCancelledEvent = (json: object): boolean => {
  let failedChecks: string[] = new Array();
  const event: any = json as Schema$Event;

  // check "json" if it contains all required properties
  requiredProperties.forEach((property: Property) => {
    if (!event[property.key]) failedChecks.push(`${property.key} not existing`);
    if (property.value && event[property.key] !== property.value)
      failedChecks.push(`${property.key} not matching ${property.value}`);
  });

  if (failedChecks.length > 0) return false;

  return true;
};
