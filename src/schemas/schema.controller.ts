import {
  Get,
  Post,
  Route,
  Response,
  SuccessResponse,
  Tags,
  Delete,
} from "tsoa";
import eventsSchema from "../events/search/schema";
import client from "../events/search/client";
import { HttpError } from "http-errors";
import createHttpError from "http-errors";
import { TypesenseError } from "typesense/lib/Typesense/Errors";

export type GetSchemaResponse = any;
export type DeleteSchemaResponse = any;

@Route("schema")
@Tags("Schema")
export default class SchemaController {
  /**
   * Get the schema for the events collection.
   */
  @Get("")
  @SuccessResponse(200, "OK")
  @Response<Error>(404, "Not Found")
  @Response<Error>(401, "Unauthorized")
  @Response<Error>(500, "Server Error")
  public async getSchema(): Promise<GetSchemaResponse> {
    return await client
      .collections()
      .retrieve()
      .then((data: any[]) => {
        const eventSchema: any = data.filter(
          (schema: any) => schema.name === eventSchema.name
        )[0];
        if (data.length === 0 || !eventSchema) {
          throw createHttpError(404, "Schema not found.");
        } else {
          return eventSchema;
        }
      })
      .catch((error: HttpError | TypesenseError) => {
        let httpCode: number | undefined;
        if (error instanceof TypesenseError) httpCode = error?.httpStatus;
        if (error instanceof HttpError) httpCode = error?.status;
        throw createHttpError(
          httpCode || 500,
          error.message || "Could not fetch schema for unknown reason."
        );
      });
  }

  /**
   * Create the schema for the events collection.
   */
  @Post("")
  @SuccessResponse(201, "Created")
  @Response<Error>(401, "Unauthorized")
  @Response<Error>(409, "ObjectAlreadyExists")
  public async createSchema(): Promise<DeleteSchemaResponse> {
    return await client
      .collections()
      .create(eventsSchema)
      .then((data: any) => {
        return data;
      })
      .catch((error: TypesenseError) => {
        throw createHttpError(
          error?.httpStatus || 500,
          error.message || "Could not create schema for unknown reason."
        );
      });
  }

  /**
   * Delete the schema incl. all data of the events collection.
   */
  @Delete("")
  @SuccessResponse("200", "Deleted")
  @Response<Error>(401, "Unauthorized")
  @Response<Error>(404, "ObjectNotFound")
  @Response<Error>(422, "Validation Failed")
  public async deleteSchema(): Promise<DeleteSchemaResponse> {
    return await client
      .collections(eventsSchema.name)
      .delete()
      .then((data: any) => {
        return data;
      })
      .catch((error: TypesenseError) => {
        throw createHttpError(
          error?.httpStatus || 500,
          error.message || "Could not delete schema for unknown reason."
        );
      });
  }
}
