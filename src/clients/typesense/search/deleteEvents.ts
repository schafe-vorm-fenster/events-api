import createHttpError from "http-errors";
import client from "./client";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import { getLogger } from "@/src/logging/logger";
import eventsSchema from "@/src/events/schema/typesense.schema";
import { getEndedBeforeFilter } from "./filters/get-ended-before-filter";
import { ApiEvents } from "@/src/logging/loggerApps.config";

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
  const log = getLogger(ApiEvents.delete);

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
  } catch (err: unknown) {
    throw createHttpError(
      400,
      (err as Error)?.message || "cannot build a before filter"
    );
  }
  log.debug({ beforeFilter: beforeFilter }, "deleteEvents query");

  // init result
  const result: DeleteEventsResult = {
    deleted: 0,
  };

  // delete by single id
  if (query.id) {
    await client
      .collections(eventsSchema.name)
      .documents(query.id)
      .delete()
      .then(function () {
        result.deleted++;
      })
      .catch((error: TypesenseError | unknown) => {
        let httpCode: number | undefined;
        if (error instanceof TypesenseError) httpCode = error?.httpStatus;
        throw createHttpError(
          httpCode || 500,
          (error as Error)?.message || "error while deleting single event"
        );
      });
  }

  // delete by multiple ids
  if (query.ids && query.ids.length > 0) {
    await client
      .collections(eventsSchema.name)
      .documents()
      .delete({ filter_by: `id:[${query.ids.join(",")}]` })
      .then(function (deleteResult: unknown) {
        result.deleted =
          result.deleted +
          (deleteResult as { num_deleted: number }).num_deleted;
      })
      .catch((error: TypesenseError | Error) => {
        let httpCode: number | undefined;
        if (error instanceof TypesenseError) httpCode = error?.httpStatus;
        throw createHttpError(
          httpCode || 500,
          error.message || "error while deleting events by id list"
        );
      });
  }

  // delete by before
  if (query.before && beforeFilter) {
    await client
      .collections(eventsSchema.name)
      .documents()
      .delete({ filter_by: beforeFilter })
      .then(function (deleteResult: unknown) {
        result.deleted =
          result.deleted +
          (deleteResult as { num_deleted: number }).num_deleted;
      })
      .catch((error: TypesenseError | Error) => {
        let httpCode: number | undefined;
        if (error instanceof TypesenseError) httpCode = error?.httpStatus;
        throw createHttpError(
          httpCode || 500,
          error.message || "error while deleting events before date"
        );
      });
  }
  // return combined result
  return result;
};
