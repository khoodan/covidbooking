import { DynamoDB, ScanCommand } from "@aws-sdk/client-dynamodb";
import { UserSchema } from "@schema/UserSchema";
import { UserClient } from "../UserClient";
import { DynamoClient } from "./DynamoClient";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class DynamoUserClient extends DynamoClient implements UserClient {
  constructor() {
    super('user')
  }

  async getUsers(): Promise<UserSchema[]> {
    const params = {
      TableName: this.table,
    };
    const response = await this.client.send(new ScanCommand(params))
    const users = response.Items.map(item => unmarshall(item))

    return users;
  }
}