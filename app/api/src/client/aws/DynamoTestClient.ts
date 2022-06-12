import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { CreateTestSchema, TestDBSchema } from "@schema/TestSchema";
import { TestClient } from "../TestClient";
import { DynamoClient } from "./DynamoClient";

export class DynamoTestClient extends DynamoClient implements TestClient {
  constructor() {
    super('test')
  }

  async getTests(): Promise<TestDBSchema[]> {
    const params = {
      TableName: this.table,
    };
    const response = await this.client.send(new ScanCommand(params))
    const tests = response.Items.map(item => unmarshall(item))

    return tests;
  }

  async addTest(test: CreateTestSchema): Promise<void> {
    await this.client.send(new PutCommand({
      TableName: this.table,
      Item: test
    }))
  }

  getTestForId(testId: string): Promise<TestDBSchema> {
    throw new Error("Method not implemented.");
  }
}