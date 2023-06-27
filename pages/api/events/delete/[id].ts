import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../../logging/loggerApps.config";
import { getLogger } from "../../../../logging/logger";
import {
  DeleteEventsResult,
  deleteEvents,
} from "../../../../src/events/search/deleteEvents";
import { HttpError } from "http-errors";

export type DeleteEventResponse = DeleteEventsResult;

/**
 * @swagger
 * /api/events/delete/{id}:
 *   delete:
 *     summary: Deletes a single event.
 *     description:
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         description: Event id, usually an uuid.
 *         in: path
 *         required: true
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
  const log = getLogger(api.events["delete-by-id"]);

  const id: string = req.query.id as string;

  return await deleteEvents({
    id: id,
  })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error: HttpError | any) => {
      let httpCode: number | undefined;
      if (error instanceof HttpError) httpCode = error?.status;
      log.error(
        { status: httpCode, message: error.message },
        "deleting an event failed"
      );
      return res.status(httpCode || 500).json({
        status: httpCode || 500,
        message: error.message || "error while deleting an event",
      });
    });
}
