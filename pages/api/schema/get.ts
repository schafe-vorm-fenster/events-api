import type { NextApiRequest, NextApiResponse } from "next";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import createHttpError, { HttpError } from "http-errors";
import client from "../../../src/events/search/client";
import { MinimalCacheControlHeader } from "../../../src/config/MinimalCacheControlHeader";
import eventsSchema from "../../../src/events/search/schema";

export type GetSchemaResponse = any;

/**
 * @swagger
 * /api/schema/get:
 *   get:
 *     summary: Get the schema for the events collection.
 *     description:
 *     tags:
 *       - Schema
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Shows the schema for the events collection.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetSchemaResponse>
) {
  return await client
    .collections(eventsSchema.name)
    .retrieve()
    .then((data: any) => {
      if (data?.name !== eventsSchema.name)
        throw createHttpError(404, "Schema not found.");
      return res
        .status(200)
        .setHeader("Cache-Control", MinimalCacheControlHeader)
        .json(data);
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
