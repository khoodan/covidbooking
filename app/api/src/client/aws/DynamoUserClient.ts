import { UserSchema } from "@schema/UserSchema";
import { UserClient } from "../UserClient";
import { DynamoClient } from "./DynamoClient";

export class DynamoUserClient extends DynamoClient implements UserClient {
  constructor() {
    super('user')
  }

  async getUsers(): Promise<UserSchema[]> {
    const params = {
      TableName: this.table
    };
    const userids = await this.client.scan(params).promise();
    return userids.Items;
  }
}