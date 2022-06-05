import { UserSchema } from "@schema/UserSchema";
import { DynamoUserClient } from "src/client/aws/DynamoUserClient";
import { UserClient } from "src/client/UserClient";

export class UserService {
  userClient: UserClient = new DynamoUserClient()

  getUsers(): Promise<UserSchema[]> {
    return this.userClient.getUsers()
  }
}