import type { NextApiRequest, NextApiResponse } from "next";
import {
  GoogleCalendarGetDetailsQuery,
  GoogleCalendarGetDetailsResponse,
} from "../../../../src/apiclients/googlecalendar/googleCalendarGetDetails";
import { googleCalendarGetDetailsCached } from "../../../../src/apiclients/googlecalendar/googleCalendarGetDetailsCached";

/**
 * @swagger
 * /api/vendor/googlecalendar/getdetails:
 *   get:
 *     summary: Get detail information about a specific calendar from google calendar.
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
 *     responses:
 *       200:
 *         description: Google calendar detail information.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { calendarId } = req.query;

  if (!calendarId)
    return res
      .status(400)
      .end("Missing identifier. Please provide a calendarId as string.");

  const query: GoogleCalendarGetDetailsQuery = {
    calendarId: <string>calendarId,
  };

  const data: GoogleCalendarGetDetailsResponse | null =
    await googleCalendarGetDetailsCached(query);

  if (!data)
    return res.status(204).end("Could not find a matching postal code.");

  return res.status(200).json(data);
}
