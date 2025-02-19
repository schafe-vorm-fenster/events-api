import { getLogger } from "@/logging/logger";
import { clientLogger } from "@/logging/loggerApps.config";
import createError from "http-errors";
import client from "./client";
import eventsSchema from "./schema";
import { GetEventSuccessfulSchema } from "../../app/api/events/[id]/single-event.schema";

const log = getLogger(clientLogger.typesense.get);

export async function getEvent(id: string): Promise<GetEventSuccessfulSchema> {
  try {
    const event = await client
      .collections(eventsSchema.name)
      .documents(id)
      .retrieve();

    return {
      status: 200,
      timestamp: new Date().toISOString(),
      data: event,
    };
  } catch (error: any) {
    const httpCode = error.httpStatus === 404 ? 404 : 500;

    log.error(
      { status: httpCode, message: error.message },
      "retrieving an event failed"
    );

    throw createError(httpCode, error.message || "Internal Server Error");
  }
}
