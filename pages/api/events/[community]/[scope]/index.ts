import type { NextApiRequest, NextApiResponse } from "next";
import { isValidGeonameId } from "../../../../../src/events/geocode/helpers/isValidGeonameId";
import { isRuralEventScope } from "../../../../../packages/rural-event-types/src/helpers/isRuralEventScope";
import { CacheControlHeader } from "../../../../../src/config/CacheControlHeader";
import { getLogger } from "../../../../../logging/logger";
import { api } from "../../../../../logging/loggerApps.config";
import { searchEvents } from "../../../../../src/events/search/searchEvents";
import { HttpError } from "http-errors";
import { RuralEventScope } from "../../../../../packages/rural-event-types/src/ruralEventScopes";
import { isISO8601 } from "../../../../../src/events/helpers/datetime/isISO8601";

/**
 * @swagger
 * /api/events/{community}/{scope}:
 *   get:
 *     summary: Events for a given community and a specific scope.
 *     description: Returns a list of events for a given community and a specific scope.
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
 *       - name: after
 *         description: Datetime in ISO8601 format to filter for events occurring after this point in time. Events starting before but ending after, will be included.
 *         in: query
 *         required: false
 *         type: string
 *       - name: before
 *         description: Datetime in ISO8601 format to filter for events occurring before this point in time. Events starting before but ending after, will be included.
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

  const scopeParam: string = req?.query?.scope as RuralEventScope;
  if (!isRuralEventScope(scopeParam)) {
    res.status(400).json({ status: 400, message: "Invalid scope parameter" });
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

  // TODO: get geopoint, geonamesId and municipalityId for given community from geo-api
  const center: [number, number] = [53.9206, 13.5802];
  const communityId: string = "geoname.2838887";
  const municipalityId: string = "geoname.6548320";
  const countyId: string = "geoname.8648415";
  const stateId: string = "geoname.2872567";
  const countryId: string = "geoname.2921044";

  return await searchEvents({
    center: {
      geopoint: center,
      communityId: communityId,
      municipalityId: municipalityId,
      countyId: countyId,
      stateId: stateId,
      countryId: countryId,
    },
    scope: scopeParam as RuralEventScope,
    containTighterScopes: true,
    after: afterParam,
    before: beforeParam,
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
      return res.status(httpCode || 500).json({
        status: httpCode || 500,
        message: error.message || "Error while searching for events",
      });
    });
}
