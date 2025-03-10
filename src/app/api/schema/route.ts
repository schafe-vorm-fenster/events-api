import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/logging/logger";
import { apiLogger } from "@/logging/loggerApps.config";
import { SchemaContract } from "./schema.contract";
import { HttpError } from "http-errors";
import client from "@/src/events/search/client";
import eventsSchema from "@/src/events/schema/typesense.schema";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import {
  AddSchemaSuccessfulSchema,
  DeleteSchemaSuccessfulSchema,
  GetSchemaSuccessfulSchema,
} from "./schema.schema";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";

const handler = createNextHandler(
  SchemaContract,
  {
    "get-schema": async () => {
      const log = getLogger(apiLogger.schema.get);

      try {
        const data = await client.collections(eventsSchema.name).retrieve();
        log.debug({ data }, "Fetched schema data.");

        return {
          status: 200,
          body: {
            status: 200,
            timestamp: new Date().toISOString(),
            data,
          } as GetSchemaSuccessfulSchema,
        };
      } catch (error: any) {
        const httpCode =
          error instanceof TypesenseError
            ? error.httpStatus
            : error instanceof HttpError
            ? error.status
            : 500;
        return {
          status: (httpCode as 404) || 500,
          body: {
            status: httpCode || 500,
            error:
              error.message || "Could not fetch schema for unknown reason.",
          } as ErrorSchema,
        };
      }
    },
    "create-schema": async () => {
      const log = getLogger(apiLogger.schema.create);

      try {
        const data = await client.collections().create(eventsSchema);
        return {
          status: 200,
          body: {
            status: 200,
            timestamp: new Date(data.created_at * 1000).toISOString(),
            data,
          } as AddSchemaSuccessfulSchema,
        };
      } catch (error: any) {
        const httpCode =
          error instanceof TypesenseError
            ? error.httpStatus
            : error instanceof HttpError
            ? error.status
            : 500;
        return {
          status: (httpCode as 409) || 500,
          body: {
            status: httpCode,
            error:
              error.message || "Could not create schema for unknown reason.",
          } as ErrorSchema,
        };
      }
    },
    "delete-schema": async () => {
      const log = getLogger(apiLogger.schema.delete);

      try {
        const data = await client.collections(eventsSchema.name).delete();
        return {
          status: 200,
          body: {
            status: 200,
            timestamp: new Date().toISOString(),
            data,
          } as DeleteSchemaSuccessfulSchema,
        };
      } catch (error: any) {
        const httpCode =
          error instanceof TypesenseError
            ? error.httpStatus
            : error instanceof HttpError
            ? error.status
            : 500;
        return {
          status: (httpCode as 404) || 500,
          body: {
            status: httpCode,
            error:
              error.message || "Could not delete schema for unknown reason.",
          } as ErrorSchema,
        };
      }
    },
  },
  {
    jsonQuery: true,
    responseValidation: true,
    handlerType: "app-router",
    errorHandler: handleZodError,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
