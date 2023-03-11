import { PostEventRequestBody } from "../events.types";

/**
 * validate event json object against minimal requirements
 * @param eventJson
 * @returns boolean
 */
export const validateEventJsonObject = (
  eventJson: PostEventRequestBody
): boolean => {
  const errors: string[] = [];
  if (!eventJson.summary) errors.push("summary is required");
  // TODO: add more checks
  if (errors.length > 0) throw new Error(errors.join(", "));
  return true;
};
