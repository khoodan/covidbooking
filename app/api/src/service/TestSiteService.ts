import { TestSiteSchema } from "@schema/LocationSchema";
import { DynamoTestSiteClient } from "src/client/aws/DynamoTestSiteClient";
import { TestSiteClient } from "src/client/TestSiteClient";
import { DataService } from "./DataService";

export interface GetTestSiteParams {

}

export class TestSiteService extends DataService {
  private testSiteClient: TestSiteClient = new DynamoTestSiteClient()

  getTestSiteForId(id: string, params: GetTestSiteParams): Promise<TestSiteSchema> {
    return Promise.resolve({})
  }
}

export const testSiteService = new TestSiteService()