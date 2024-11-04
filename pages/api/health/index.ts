import type { NextApiRequest, NextApiResponse } from "next";
import packageJson from '../../../package.json' assert { type: 'json' };


/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Returns a health check.
 *     description: Provides a health check.
 *     tags:
 *       - Health
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: API is healthy.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return res.status(200)
  .json({
    status: 200,
    version: packageJson.version,
    name: packageJson.name,
    description: packageJson.description,
  });

}
