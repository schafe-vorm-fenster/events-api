import { Get, Route, Tags } from "tsoa";

interface UsersResponse {
  name: string;
}

@Route("users")
@Tags("User")
export default class UserController {
  @Get("/")
  public async getUsers(): Promise<UsersResponse> {
    return { name: "jan" };
  }
}
