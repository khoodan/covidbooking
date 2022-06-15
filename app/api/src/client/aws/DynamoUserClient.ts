import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { UserDBSchema } from "@schema/UserSchema";
import { UserClient } from "../UserClient";
import { DynamoClient } from "./DynamoClient";

export class DynamoUserClient extends DynamoClient implements UserClient {
  constructor() {
    super('user')
  }

  async getUsers(): Promise<UserDBSchema[]> {
    const params = {
      TableName: this.table,
    };
    const response = await this.client.send(new ScanCommand(params))
    const users = response.Items.map(item => unmarshall(item))

    return users;
  }

  async addUser(user: UserDBSchema): Promise<void> {
    await this.client.send(new PutCommand({
      TableName: this.table,
      Item: user
    }))
  }

  getTestById(userId: string): Promise<UserDBSchema> {
    throw new Error("Method not implemented.");
  }
}