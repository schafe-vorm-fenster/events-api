import type { NextApiRequest, NextApiResponse } from "next";
import {
  GoogleCalendarEventsListQuery,
  GoogleCalendarEventsListResponse,
} from "../../../../src/apiclients/googlecalendar/googleCalendarEventsList";
import { googleCalendarEventsListCached } from "../../../../src/apiclients/googlecalendar/googleCalendarEventsListCached";

/**
 * @swagger
 * /api/vendor/googlecalendar/getevents:
 *   get:
 *     summary: Get events of a specific calendar from google calendar.
 *     description:
 *     tags:
 *       - Vendor - Google Calendar API
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: calendarId
 *         description: Google calendar id, e.g. "de.german#holiday@group.v.calendar.google.com".
 *         in: query
 *         required: true
 *         type: string
 *       - name: timeMin
 *         description: Number of days in the future, from which the data fetching should start. Default is 0.
 *         in: query
 *         required: false
 *         type: number
 *       - name: timeMax
 *         description: Number of days in the future, until which the data fetching should be done. Default is 30.
 *         in: query
 *         required: false
 *         type: number
 *       - name: updatedMin
 *         description: If set, filter events if they were updated or deleted n days in the past. Limited to 29 days past.
 *         in: query
 *         required: false
 *         type: number
 *     responses:
 *       200:
 *         description: List of google calendar events.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { calendarId, timeMin, timeMax, updatedMin } = req.query;

  if (!calendarId)
    return res
      .status(400)
      .end("Missing identifier. Please provide a calendarId as string.");

  const query: GoogleCalendarEventsListQuery = {
    calendarId: <string>calendarId,
    timeMin: timeMin ? parseInt(<string>timeMin) : undefined,
    timeMax: timeMax ? parseInt(<string>timeMax) : undefined,
    updatedMin: updatedMin ? parseInt(<string>updatedMin) : undefined,
  };

  const data: GoogleCalendarEventsListResponse | null =
    await googleCalendarEventsListCached(query);

  if (!data)
    return res.status(204).end("Could not find a matching postal code.");

  return res.status(200).json(data);
}
