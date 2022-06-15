import { AllTestSchema, TestSchema } from "@schema/TestSchema";
import { DynamoTestClient } from "src/client/aws/DynamoTestClient";
import { TestClient } from "src/client/TestClient";
import { BookingService, bookingServiceInstance, GetBookingParams } from "./BookingService";
import { GetUserParams, UserService, userServiceInstance } from "./UserService";

export interface GetTestParams {
  includePatient?: boolean;
  includeAdministerer?: boolean;
  includeBooking?: boolean;
}

export class TestService {
  private testClient: TestClient = new DynamoTestClient();
  private userService: UserService = userServiceInstance
  private bookingService: BookingService = bookingServiceInstance

  private userParams: GetUserParams = {
    includeBookings: false,
    includeTestsAdministered: false,
    includeTestsTaken: false
  }

  private bookingParams: GetBookingParams = {
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
    test.patient = await this.userService.getUserById(test.patientId, this.userParams)
  }

  private async getAdministerer(test: AllTestSchema) {
    test.administerer = await this.userService.getUserById(test.administererId, this.userParams)
  }

  private async getBooking(test: AllTestSchema) {
    test.booking = await this.bookingService.getBookingsForId(test.bookingId, this.bookingParams)
  }
}

export const testServiceInstance = new TestService()