import type { NextApiRequest, NextApiResponse } from "next";
import { isValidGeonameId } from "../../../../src/events/geocode/helpers/isValidGeonameId";
import { CacheControlHeader } from "../../../../src/config/CacheControlHeader";
import { getLogger } from "../../../../logging/logger";
import { api } from "../../../../logging/loggerApps.config";
import { searchEvents } from "../../../../src/events/search/searchEvents";
import { RuralEventScope } from "../../../../packages/rural-event-types/dist/ruralEventTypes";
import { HttpError } from "http-errors";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import { isISO8601 } from "../../../../src/events/helpers/datetime/isISO8601";
import { after } from "node:test";

/**
 * @swagger
 * /api/events/{community}/:
 *   get:
 *     summary: Events for a given community.
 *     description: Returns a list of events for a given community.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: community
 *         description: Geoname id of a community in the format "geoname.2838887".
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
  const log = getLogger(api.events.community);
  const communityParam: string = req?.query?.community as string;
  if (!isValidGeonameId(communityParam)) {
    res
      .status(400)
      .json({ status: 400, message: "invalid community parameter" });
  }

  // extract after and before
  const afterParam: string | undefined =
    (req.query?.after as string) || undefined;
  if (afterParam && !isISO8601(afterParam)) {
    res
      .status(400)
      .json({ status: 400, message: "invalid date format for after param" });
  }

  const beforeParam: string | undefined =
    (req.query?.before as string) || undefined;
  if (beforeParam && !isISO8601(beforeParam)) {
    res
      .status(400)
      .json({ status: 400, message: "invalid date format for before param" });
  }

  // TODO: get geopoint, geonamesId and municipalityId for given community from geo-api
  const center: [number, number] = [53.9206, 13.5802];
  const communityId: string = communityParam;
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
    scope: "community", // TODO: check which should be the default scope if not set
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
        message: error.message || "error while searching for events",
      });
    });
}
