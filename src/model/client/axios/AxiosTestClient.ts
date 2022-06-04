import { TestFactory } from "../../test/factory/TestFactory";
import { RecordCollection } from "../../test/RecordCollection";
import { Test } from "../../test/Test";
import { CovidTestSchema } from "../schema/CovidTestSchema";
import { TestClient } from "../TestClient";
import { AxiosClient } from "./AxiosClient";

/**
 * TestClient Implementation
 * Deals with getting data for tests
 */
export class AxiosTestClient extends AxiosClient implements TestClient {
  /**
   * Initialise the client with the covid-test path
   */
  constructor() {
    super('/covid-test')
  }

  /**
   * Get Tests from API
   * @returns {Test[]} tests from API
   */
  public async getTests(): Promise<RecordCollection> {
    const rawTestData = await this.client.get('/')
    const testData: CovidTestSchema[] = rawTestData.data
    const tests: Test[] = testData.map(rawTest => TestFactory.instance.createTest(rawTest))
    return new RecordCollection(tests)
  }

  /**
   * Posts a test to the API
   * @param test to post
   */
  public async postTest(test: Test): Promise<void> {
    await this.client.post('/', {
      type: test.getType(),
      patientId: test.getPatientId(),
      administererId: test.getAdministererId(),
      bookingId: test.getBookingId(),
      result: test.getResult(),
      status: test.getStatus(),
      notes: test.getNotes(),
      additionalInfo: {}
    })
  }
}