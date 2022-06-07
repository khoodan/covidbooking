import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TestSiteSchema } from "@schema/LocationSchema";
import { TestSiteClient } from "../TestSiteClient";
import { DynamoClient } from "./DynamoClient";

export class DynamoTestSiteClient extends DynamoClient implements TestSiteClient {
  constructor() {
    super('testsite')
  }

  async getTestSites(): Promise<TestSiteSchema[]> {
    const params = {
      TableName: this.table,
    };
    const response = await this.client.send(new ScanCommand(params))
    const testsites = response.Items.map(item => unmarshall(item))

    return testsites;
  }

  async addTestSite(testsite: TestSiteSchema): Promise<void> {
    await this.client.send(new PutCommand({
      TableName: this.table,
      Item: testsite
    }))
  }
}