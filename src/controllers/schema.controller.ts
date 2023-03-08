import {
  Body,
  Get,
  Path,
  Post,
  Query,
  Route,
  Response,
  SuccessResponse,
  Tags,
  Delete,
} from "tsoa";
import eventsSchema from "../search/schema/eventsSchema";
import client from "../search/typesenseClient";

type ListSchemasResponse = any;
type DeleteSchemaResponse = any;

@Route("schema")
@Tags("Schema")
export default class SchemaController {
  @Get("list")
  @SuccessResponse("201", "Found")
  @Response<Error>(401, "Unauthorized")
  @Response<Error>(422, "Validation Failed")
  public async listSchemas(): Promise<ListSchemasResponse> {
    const collections: any = await client.collections().retrieve();
    return { name: "jan", debug: collections };
  }

  @Post("{schema}")
  @SuccessResponse("201", "Created")
  @Response<Error>(401, "Unauthorized")
  @Response<Error>(422, "Validation Failed")
  @Response<Error>(409, "ObjectAlreadyExists")
  public async createSchema(
    @Path() schema: string
  ): Promise<DeleteSchemaResponse> {
    const result: any = await client
      .collections()
      .create(eventsSchema)
      .then(
        (data: any) => {
          console.debug(data);
          return data;
        },
        (err: any) => {
          return err;
        }
      );
    return { name: "jan", debug: result };
  }

  @Delete("{schema}")
  @SuccessResponse("201", "Deleted")
  @Response<Error>(401, "Unauthorized")
  @Response<Error>(404, "ObjectNotFound")
  @Response<Error>(422, "Validation Failed")
  public async deleteSchema(
    @Path() schema: string
  ): Promise<DeleteSchemaResponse> {
    const result: any = await client
      .collections(schema)
      .delete()
      .then(
        (data: any) => {
          console.debug(data);
          return data;
        },
        (err: any) => {
          return err;
        }
      );
    return { name: "DELETE", debug: result };
  }
}
