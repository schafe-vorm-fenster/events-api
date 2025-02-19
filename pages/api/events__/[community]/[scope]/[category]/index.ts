import type { NextApiRequest, NextApiResponse } from "next";
import { isValidGeonameId } from "../../../../../../src/events/geocode/helpers/isValidGeonameId";
import { isRuralEventScope } from "../../../../../../packages/rural-event-types/src/helpers/isRuralEventScope";
import { isRuralEventCategory } from "../../../../../../packages/rural-event-categories/src/helpers/isRuralEventCategory";
import { CacheControlHeader } from "../../../../../../src/config/CacheControlHeader";
import { getLogger } from "../../../../../../logging/logger";
import { api } from "../../../../../../logging/loggerApps.config";
import {
  CommunityCenterQuery,
  searchEvents,
} from "../../../../../../src/events/search/searchEvents";
import { RuralEventScope } from "../../../../../../packages/rural-event-types/src/ruralEventScopes";
import { HttpError } from "http-errors";
import { RuralEventCategoryId } from "../../../../../../packages/rural-event-categories/src/types/ruralEventCategory.types";
import { isISO8601 } from "../../../../../../src/events/helpers/datetime/isISO8601";
import { SvfLocale } from "../../../../../../src/languages/languages.types";
import { getCommunityCenter } from "../../../../../../src/events/search/helpers/getCommunityCenter";
import { extractGeonameId } from "../../../../../../src/events/geocode/helpers/extractGeonameId";

/**
 * @swagger
 * /api/events/{community}/{scope}/{category}:
 *   get:
 *     summary: Events for a given community, a specific scope and a specific category.
 *     description: Returns a list of events for a given community, a specific scope and a specific category.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: community
 *         description: Geoname id of a community in the format "geoname.2838887".
 *         in: path
 *         required: true
 *         type: string
 *       - name: scope
 *         description: Scope filter.
 *         in: path
 *         required: true
 *         type: string
 *       - name: category
 *         description: Category filter.
 *         in: path
 *         required: true
 *         type: string
 *       - name: after
 *         description: Datetime in ISO8601 format to filter for events occurring after this point in time. Events starting before but ending after, will be included.
 *         in: query
 *         required: false
 *         type: string
 *       - name: before
 *         description: Datetime in ISO8601 format to filter for events occurring before this point in time. Events starting before but ending after, will be included.
 *         in: query
 *         required: false
 *       - name: language
 *         in: query
 *         required: false
 *         type: string
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

  // extract after and before
  const afterParam: string | undefined =
    (req.query?.after as string) || undefined;
  if (afterParam && !isISO8601(afterParam)) {
    res
      .status(400)
      .json({ status: 400, message: "Invalid date format for after param" });
  }

  const beforeParam: string | undefined =
    (req.query?.before as string) || undefined;
  if (beforeParam && !isISO8601(beforeParam)) {
    res
      .status(400)
      .json({ status: 400, message: "Invalid date format for before param" });
  }

  // extract language
  const language: string | undefined =
    (req.query?.language as string) || undefined;

  // get community details to configure scoped search
  const communityCenter: CommunityCenterQuery = await getCommunityCenter(
    extractGeonameId(communityParam)
  );

  return await searchEvents({
    center: communityCenter,
    scope: scopeParam as RuralEventScope,
    containTighterScopes: true,
    category: categoryParam as RuralEventCategoryId,
    after: afterParam,
    before: beforeParam,
    language: language as SvfLocale,
  })
    .then((result) => {
      return res
        .status(200)
        .setHeader("Cache-Control", CacheControlHeader)
        .json(result);
    })
    .catch((error: HttpError | any) => {
      let httpCode: number | undefined;
      if (error instanceof HttpError) httpCode = error?.status;
      log.error(
        { status: httpCode, message: error.message },
        "searching for events failed"
      );
      return res.status(httpCode || 500).json({
        status: httpCode || 500,
        message: error.message || "error while searching for events",
      });
    });
}
