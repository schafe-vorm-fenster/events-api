import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../../logging/loggerApps.config";
import { getLogger } from "../../../../logging/logger";
import {
  DeleteEventsResult,
  deleteEvents,
} from "../../../../src/events/search/deleteEvents";
import { isISO8601 } from "../../../../src/events/helpers/datetime/isISO8601";
import { HttpError } from "http-errors";

export type DeleteEventResponse = DeleteEventsResult;

/**
 * @swagger
 * /api/events/delete/:
 *   delete:
 *     summary: Deletes events before a certain date/time.
 *     description:
 *     tags:
 *       - Events
 *     parameters:
 *       - name: before
 *         description: now or datetime in ISO8601 format to delete events occurring before this point in time. Only events starting and ending before, will be deleted.
 *         in: query
 *         required: false
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Number of deleted events.
 *       400:
 *         description: Invalid date format for before param.
 *       404:
 *         description: No events deleted.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteEventResponse | any>
) {
  const log = getLogger(api.events["delete-by-date"]);

  const beforeParam: string | undefined =
    (req.query?.before as string) || undefined;
  if (
    beforeParam &&
    !isISO8601(beforeParam) &&
    beforeParam.toLowerCase() !== "now"
  ) {
    res
      .status(400)
      .json({ status: 400, message: "invalid date format for before param" });
  }

  return await deleteEvents({
    before: beforeParam,
  })
    .then((result) => {
      if (result?.deleted == 0) {
        return res.status(404).json(result);
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((error: HttpError | any) => {
      let httpCode: number | undefined;
      if (error instanceof HttpError) httpCode = error?.status;
      log.error(
        { status: httpCode, message: error.message },
        "deleting of events failed"
      );
      return res.status(httpCode || 500).json({
        status: httpCode || 500,
        message: error.message || "error while deleting events",
      });
    });
}
