import { getLogger } from "@/logging/logger";
import { clientLogger } from "@/logging/loggerApps.config";
import createError from "http-errors";
import client from "./client";
import eventsSchema from "@/src/events/schema/typesense.schema";
import { GetEventSuccessfulSchema } from "@/src/app/api/events/[id]/single-event.schema";

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
  } catch (error: unknown) {
    const httpCode =
      (error as { httpStatus?: number }).httpStatus === 404 ? 404 : 500;

    log.error(
      { status: httpCode, message: (error as Error).message },
      "retrieving an event failed"
    );

    throw createError(
      httpCode,
      (error as Error).message || "Internal Server Error"
    );
  }
}
