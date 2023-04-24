import type { NextApiRequest, NextApiResponse } from "next";
import { SvfLanguage } from "../../../src/languages/languages.types";
import { svfLocales } from "../../../src/languages/languages.config";
import { ConfigCacheControlHeader } from "../../../src/config/ConfigCacheControlHeader";

export type LanguagesResponse = ReadonlyArray<SvfLanguage>;

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
  return res
    .status(200)
    .setHeader("Cache-Control", ConfigCacheControlHeader)
    .json(svfLocales);
}
