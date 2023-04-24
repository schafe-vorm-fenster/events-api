import type { NextApiRequest, NextApiResponse } from "next";
import { ConfigCacheControlHeader } from "../../../src/config/ConfigCacheControlHeader";
import { ruralEventCategories } from "../../../packages/rural-event-categories/src/types/ruralEventCategory";
import { RuralEventCategory } from "../../../packages/rural-event-categories/src/types/ruralEventCategory.types";

export type CategoriesResponse = ReadonlyArray<RuralEventCategory>;

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Returns a list of categories supported by the app incl. all locales.
 *     description:
 *     tags:
 *       - Configuration
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of categories supported by the app.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoriesResponse>
) {
  return res
    .status(200)
    .setHeader("Cache-Control", ConfigCacheControlHeader)
    .json(ruralEventCategories);
}
