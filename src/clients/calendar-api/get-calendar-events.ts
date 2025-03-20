import { ISO8601 } from "@/src/rest/iso8601.types";
import { getCalendarApiConfig } from "./helpers/config";
import { ResultsSchema } from "@/src/rest/results.schema";
import { z } from "zod";
import { getLogger } from "@/src/logging/logger";
import { ClientCalendar } from "@/src/logging/loggerApps.config";

const log = getLogger(ClientCalendar.events);

const CalendarApiResponseSchema = ResultsSchema.extend({
  data: z.array(z.any()),
});
type CalendarApiResponse = z.infer<typeof CalendarApiResponseSchema>;

/**
 * Fetches calendar events from the calendar-api.
 * @param id: string
 * @param timeMin: ISO8601
 * @param timeMax: ISO8601
 * @param updatedMin: ISO8601
 * @returns Promise<object[]>
 * @throws Error
 */
export const getCalendarEvents = async (
  id: string,
  timeMin?: ISO8601,
  timeMax?: ISO8601,
  updatedMin?: ISO8601
): Promise<object[]> => {
  const { host, token } = getCalendarApiConfig();
  const url: URL = new URL(`/api/calendars/${id}/events`, host);
  if (timeMin) url.searchParams.append("timeMin", timeMin);
  if (timeMax) url.searchParams.append("timeMax", timeMax);
  if (updatedMin) url.searchParams.append("updatedMin", updatedMin);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Sheep-Token": token,
        Accept: "application/json",
      },
    });
    const data: CalendarApiResponse = await response.json();
    CalendarApiResponseSchema.parse(data);
    return data.data;
  } catch (error) {
    log.error({ url, error }, "Failed to fetch calendar events");
    throw new Error("Failed to fetch calendar events", { cause: error });
  }
};
