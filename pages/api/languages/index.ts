import type { NextApiRequest, NextApiResponse } from "next";
import { svfLocales } from "../../../src/languages/languages.config";
import { ConfigCacheControlHeader } from "../../../src/config/ConfigCacheControlHeader";
import { api } from "../../../logging/loggerApps.config";
import { getLogger } from "../../../logging/logger";

export type LanguagesResponse = any; // TODO: add proper typing

/**
 * @swagger
 * /api/languages:
 *   get:
 *     summary: Returns a list of languages supported by the app incl. all locales.
 *     description:
 *     tags:
 *       - Configuration
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of languages supported by the app incl. all locales.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LanguagesResponse>
) {
  const log = getLogger(api.languages.get);
  return res
    .status(200)
    .setHeader("Cache-Control", ConfigCacheControlHeader)
    .json(svfLocales);
}
