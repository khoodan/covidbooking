import { AllTestSchema, TestSchema } from "@schema/TestSchema";
import { DynamoTestClient } from "src/client/aws/DynamoTestClient";
import { TestClient } from "src/client/TestClient";
import { bookingService, GetBookingParams } from "./BookingService";
import { GetUserParams, userService } from "./UserService";

export interface GetTestParams {
  includePatient?: boolean;
  includeAdministerer?: boolean;
  includeBooking?: boolean;
}

export class TestService {
  private testClient: TestClient = new DynamoTestClient();

  private static userParams: GetUserParams = {
    includeBookings: false,
    includeTestsAdministered: false,
    includeTestsTaken: false
  }

  private static bookingParams: GetBookingParams = {
    includeUser: true,
    includeCovidTests: false,
    includeTestSite: true
  }

  getTests({
    includePatient = true,
    includeAdministerer = true,
    includeBooking = true
  }: GetTestParams): Promise<TestSchema[]> {
    return Promise.resolve([])
  }

  async getTestForId(testId: string, {
    includePatient = true,
    includeAdministerer = true,
    includeBooking = true
  }: GetTestParams): Promise<TestSchema> {
    const test: AllTestSchema = await this.testClient.getTestForId(testId);
    const promises: Promise<any>[] = []
    if (includePatient) promises.push(this.getPatient(test))
    if (includeAdministerer) promises.push(this.getAdministerer(test))
    if (includeBooking) promises.push(this.getBooking(test))
    await Promise.all(promises)
    return test;
  }

  getTestsForIdList(testIdList: string[], testParams: GetTestParams): Promise<TestSchema[]> {
    return Promise.all(testIdList.map(testId => this.getTestForId(testId, testParams)))
  }

  private async getPatient(test: AllTestSchema) {
    test.patient = await userService.getUserById(test.patientId, TestService.userParams)
  }

  private async getAdministerer(test: AllTestSchema) {
    test.administerer = await userService.getUserById(test.administererId, TestService.userParams)
  }

  private async getBooking(test: AllTestSchema) {
    test.booking = await bookingService.getBookingsForId(test.bookingId, TestService.bookingParams)
  }
}

export const testService = new TestService()