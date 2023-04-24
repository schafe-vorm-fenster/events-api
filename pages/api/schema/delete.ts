import type { NextApiRequest, NextApiResponse } from "next";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import client from "../../../src/events/search/client";
import eventsSchema from "../../../src/events/search/schema";
import { HttpError } from "http-errors";

export type CreateSchemaResponse = any;

/**
 * @swagger
 * /api/schema/delete:
 *   delete:
 *     summary: Delete the schema incl. all data of the events collection.
 *     description:
 *     tags:
 *       - Schema
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Status.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSchemaResponse>
) {
  return await client
    .collections(eventsSchema.name)
    .delete()
    .then((data: any) => {
      return res.status(200).json(data);
    })
    .catch((error: HttpError | TypesenseError) => {
      let httpCode: number | undefined;
      if (error instanceof TypesenseError) httpCode = error?.httpStatus;
      if (error instanceof HttpError) httpCode = error?.status;
      return res.status(httpCode || 500).json({
        status: httpCode || 500,
        message: error.message || "Could not fetch schema for unknown reason.",
      });
    });
}
