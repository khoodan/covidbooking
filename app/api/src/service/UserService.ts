import { Status } from "@schema/Status";
import { CreateUserSchema, UserSchema } from "@schema/UserSchema";
import { randomUUID } from "crypto";
import { DynamoUserClient } from "src/client/aws/DynamoUserClient";
import { UserClient } from "src/client/UserClient";

export class UserService {
  userClient: UserClient = new DynamoUserClient()

  getUsers(): Promise<UserSchema[]> {
    return this.userClient.getUsers()
  }

  addUser(user: CreateUserSchema): Promise<void> {
    if (
      !user.givenName ||
      !user.familyName ||
      !user.userName ||
      !user.password ||
      !user.phoneNumber
    ) throw new Error(Status.BADREQUEST)

    user.id = randomUUID()

    return this.userClient.addUser(user)
  }
}