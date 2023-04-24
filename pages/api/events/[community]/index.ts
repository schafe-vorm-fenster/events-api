import type { NextApiRequest, NextApiResponse } from "next";
import { isValidGeonameId } from "../../../../src/events/geocode/helpers/isValidGeonameId";
import { CacheControlHeader } from "../../../../src/config/CacheControlHeader";
import { getLogger } from "../../../../logging/logger";
import { api } from "../../../../logging/loggerApps.config";

/**
 * @swagger
 * /api/events/{community}/:
 *   get:
 *     summary: Events for a given community.
 *     description: Returns a list of events for a given community.
 *     tags:
 *       - Events
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of events.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const log = getLogger(api.events.community);
  const communityParam: string = req?.query?.community as string;
  if (!isValidGeonameId(communityParam)) {
    res
      .status(400)
      .json({ status: 400, message: "Invalid community parameter" });
  }

  return res
    .status(200)
    .setHeader("Cache-Control", CacheControlHeader)
    .json({ query: req?.query });
}
