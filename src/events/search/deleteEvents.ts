import createHttpError from "http-errors";
import client from "./client";
import eventsSchema from "./schema";
import { getLogger } from "../../../logging/logger";
import { api } from "../../../logging/loggerApps.config";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import { getEndedBeforeFilter } from "./filters/getEndedBeforeFilter";

export interface DeleteEventsQuery {
  id?: string;
  ids?: string[];
  before?: string;
}

export interface DeleteEventsResult {
  deleted: number;
}

export const deleteEvents = async (
  query: DeleteEventsQuery
): Promise<DeleteEventsResult> => {
  const log = getLogger(api.events.delete);

  // validate params
  if (!query.id && !query.ids && !query.before) {
    throw createHttpError(
      400,
      "missing parameter, id, ids or before is required"
    );
  }

  // validate before
  let beforeFilter: string | undefined = undefined;
  try {
    beforeFilter = getEndedBeforeFilter(query.before);
  } catch (err: any) {
    throw createHttpError(400, err?.message || "cannot build a before filter");
  }
  log.debug({ beforeFilter: beforeFilter }, "deleteEvents query");

  // init result
  const result: DeleteEventsResult = {
    deleted: 0,
  };

  // delete by single id
  if (query.id) {
    const deleteByIdResult: any = await client
      .collections(eventsSchema.name)
      .documents(query.id)
      .delete()
      .then(function (deleteResult: any) {
        result.deleted++;
      })
      .catch((error: TypesenseError | any) => {
        let httpCode: number | undefined;
        if (error instanceof TypesenseError) httpCode = error?.httpStatus;
        throw createHttpError(
          httpCode || 500,
          error?.message || "error while deleting single event"
        );
      });
  }

  // delete by multiple ids
  if (query.ids && query.ids.length > 0) {
    const deleteByIdListResult: any = await client
      .collections(eventsSchema.name)
      .documents()
      .delete({ filter_by: `id:[${query.ids.join(",")}]` })
      .then(function (deleteResult: any) {
        result.deleted = result.deleted + deleteResult.num_deleted;
      })
      .catch((error: TypesenseError | any) => {
        let httpCode: number | undefined;
        if (error instanceof TypesenseError) httpCode = error?.httpStatus;
        throw createHttpError(
          httpCode || 500,
          error?.message || "error while deleting events by id list"
        );
      });
  }

  // delete by before
  if (query.before && beforeFilter) {
    const deleteBeforeResult: any = await client
      .collections(eventsSchema.name)
      .documents()
      .delete({ filter_by: beforeFilter })
      .then(function (deleteResult: any) {
        result.deleted = result.deleted + deleteResult.num_deleted;
      })
      .catch((error: TypesenseError | any) => {
        let httpCode: number | undefined;
        if (error instanceof TypesenseError) httpCode = error?.httpStatus;
        throw createHttpError(
          httpCode || 500,
          error?.message || "error while deleting events before date"
        );
      });
  }
  // return combined result
  return result;
};
