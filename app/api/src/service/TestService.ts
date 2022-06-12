import { TestSchema } from "@schema/TestSchema";
import { DynamoTestClient } from "src/client/aws/DynamoTestClient";
import { TestClient } from "src/client/TestClient";

export interface GetTestParams {
  includePatient?: boolean;
  includeAdministerer?: boolean;
  includeBooking?: boolean;
}

export class TestService {
  private testClient: TestClient = new DynamoTestClient();

  getTests({
    includePatient = true,
    includeAdministerer = true,
    includeBooking = true
  }: GetTestParams): Promise<TestSchema[]> {
    return Promise.resolve([])
  }

  getTestsForId(testId: string, {
    includePatient = true,
    includeAdministerer = true,
    includeBooking = true
  }: GetTestParams): Promise<TestSchema> {
    return this.testClient.getTestForId(testId);
  }

  getTestsForIdList(testIdList: string[], testParams: GetTestParams): Promise<TestSchema[]> {
    return Promise.all(testIdList.map(testId => this.getTestsForId(testId, testParams)))
  }
}