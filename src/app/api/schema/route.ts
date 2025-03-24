import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/src/logging/logger";
import { ApiSchema } from "@/src/logging/loggerApps.config";
import { SchemaContract } from "./schema.contract";
import { HttpError } from "http-errors";

import eventsSchema from "@/src/events/schema/typesense.schema";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import {
  AddSchemaSuccessfulSchema,
  DeleteSchemaSuccessfulSchema,
  GetSchemaSuccessfulSchema,
} from "./schema.schema";
import { ApiErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import client from "@/src/clients/typesense/search/client";

const handler = createNextHandler(
  SchemaContract,
  {
    "get-schema": async () => {
      const log = getLogger(ApiSchema.get);

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
      } catch (error: unknown) {
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
              error instanceof Error
                ? error.message
                : "Could not fetch schema for unknown reason.",
          } as ApiErrorSchema,
        };
      }
    },
    "create-schema": async () => {
      const log = getLogger(ApiSchema.create);

      try {
        const data = await client.collections().create(eventsSchema);
        log.info({ data }, "Created schema data.");
        return {
          status: 200,
          body: {
            status: 200,
            timestamp: new Date(data.created_at * 1000).toISOString(),
            data,
          } as AddSchemaSuccessfulSchema,
        };
      } catch (error: unknown) {
        const httpCode =
          error instanceof TypesenseError
            ? error.httpStatus
            : error instanceof HttpError
              ? error.status
              : 500;
        log.error({ error }, "Error creating schema.");
        return {
          status: (httpCode as 409) || 500,
          body: {
            status: httpCode,
            error:
              error instanceof Error
                ? error.message
                : "Could not create schema for unknown reason.",
          } as ApiErrorSchema,
        };
      }
    },
    "delete-schema": async () => {
      const log = getLogger(ApiSchema.delete);

      try {
        const data = await client.collections(eventsSchema.name).delete();
        log.info({ data }, "Deleted schema data.");
        return {
          status: 200,
          body: {
            status: 200,
            timestamp: new Date().toISOString(),
            data,
          } as DeleteSchemaSuccessfulSchema,
        };
      } catch (error: unknown) {
        const httpCode =
          error instanceof TypesenseError
            ? error.httpStatus
            : error instanceof HttpError
              ? error.status
              : 500;
        log.error({ error }, "Error deleting schema.");
        return {
          status: (httpCode as 404) || 500,
          body: {
            status: httpCode,
            error:
              error instanceof Error
                ? error.message
                : "Could not delete schema for unknown reason.",
          } as ApiErrorSchema,
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
