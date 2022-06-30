import type { NextApiRequest, NextApiResponse } from "next";
import {
  ZendesksellGetClientsQuery,
  ZendesksellGetClientsResult,
} from "../../../../src/apiclients/zendesksell/zendesksellGetClients";
import { zendesksellGetClientsCached } from "../../../../src/apiclients/zendesksell/zendesksellGetClientsCached";

export type GeonamesGetHierarchyQuery = {
  placename: string;
  community: string;
  municipality: string;
  county: string;
  state: string;
  country: string;
};

/**
 * @swagger
 * /api/vendor/zendesksell/clients:
 *   get:
 *     summary: Returns clients (contacts with client status) from zendesk sell.
 *     description:
 *     tags:
 *       - Vendor - Zendesk Sell
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of client from zendesk sell typed as ZendeskSellClient.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query: ZendesksellGetClientsQuery = {};
  const data: ZendesksellGetClientsResult =
    (await zendesksellGetClientsCached(query)) || null;

  if (!data)
    return res.status(204).end("Could not find a matching gonames entity.");

  return res.status(200).json(data);
}
