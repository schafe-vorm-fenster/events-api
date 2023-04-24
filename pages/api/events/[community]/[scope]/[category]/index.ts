import type { NextApiRequest, NextApiResponse } from "next";
import { isValidGeonameId } from "../../../../../../src/events/geocode/helpers/isValidGeonameId";
import { isRuralEventScope } from "../../../../../../packages/rural-event-types/src/helpers/isRuralEventScope";
import { isRuralEventCategory } from "../../../../../../packages/rural-event-categories/src/helpers/isRuralEventCategory";
import { CacheControlHeader } from "../../../../../../src/config/CacheControlHeader";
import { getLogger } from "../../../../../../logging/logger";
import { api } from "../../../../../../logging/loggerApps.config";

/**
 * @swagger
 * /api/events/{community}/{scope}/{category}:
 *   get:
 *     summary: Events for a given community, a specific scope and a specific category.
 *     description: Returns a list of events for a given community, a specific scope and a specific category.
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
  const log = getLogger(api.events.category);
  const communityParam: string = req?.query?.community as string;
  if (!isValidGeonameId(communityParam)) {
    res
      .status(400)
      .json({ status: 400, message: "Invalid community parameter" });
  }

  const scopeParam: string = req?.query?.scope as string;
  if (!isRuralEventScope(scopeParam)) {
    res.status(400).json({ status: 400, message: "Invalid scope parameter" });
  }

  const categoryParam: string = req?.query?.category as string;
  if (!isRuralEventCategory(categoryParam)) {
    res
      .status(400)
      .json({ status: 400, message: "Invalid category parameter" });
  }

  return res
    .status(200)
    .setHeader("Cache-Control", CacheControlHeader)
    .json({ query: req?.query });
}
