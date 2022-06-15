import { Status } from "@schema/Status";
import { AllUserSchema, CreateUserSchema, UserSchema } from "@schema/UserSchema";
import { randomUUID } from "crypto";
import { DynamoUserClient } from "src/client/aws/DynamoUserClient";
import { UserClient } from "src/client/UserClient";
import { BookingService, bookingServiceInstance } from "./BookingService";
import { TestService, testServiceInstance } from "./TestService";

export interface GetUserParams {
  includeBookings?: boolean;
  includeTestsTaken?: boolean;
  includeTestsAdministered?: boolean;
}

export class UserService {
  private userClient: UserClient = new DynamoUserClient()
  private bookingService: BookingService = bookingServiceInstance
  private testService: TestService = testServiceInstance

  private bookingParams = {
    includeUser: false,
    includeCovidTests: false,
    includeTestSite: true
  }

  private testParams = {
    includePatient: true,
    includeAdministerer: true,
    includeBooking: false
  }

  async getUsers({
    includeBookings = true,
    includeTestsTaken = true,
    includeTestsAdministered = true
  }: GetUserParams): Promise<UserSchema[]> {
    const users = await this.userClient.getUsers() as AllUserSchema[]
    const promises: Promise<any>[] = []
    if (includeBookings) promises.push(this.getBookingsForUsers(users))
    if (includeTestsTaken) promises.push(this.getTestsTakenForUsers(users))
    if (includeTestsAdministered) promises.push(this.getTestsAdministeredForUsers(users))
    await Promise.all(promises)
    return users
  }

  addUser(user: CreateUserSchema): Promise<void> {
    if (
      !user.givenName ||
      !user.familyName ||
      !user.userName ||
      !user.password ||
      !user.phoneNumber
    ) throw new Error(Status.BADREQUEST)

    user.id = randomUUID()

    return this.userClient.addUser(user)
  }

  async getUserById(id: string, {
    includeBookings = true,
    includeTestsTaken = true,
    includeTestsAdministered = true
  }: GetUserParams): Promise<UserSchema> {
    const user: AllUserSchema = await this.userClient.getTestById(id);
    const promises: Promise<any>[] = []
    if (includeBookings) promises.push(this.getBookings(user))
    if (includeTestsTaken) promises.push(this.getTestsTaken(user))
    if (includeTestsAdministered) promises.push(this.getTestsAdministered(user))
    await Promise.all(promises)
    return user
  }

  private async getBookingsForUsers(users: AllUserSchema[]): Promise<void> {
    await Promise.all(users.map(this.getBookings))
  }

  private async getTestsTakenForUsers(users: AllUserSchema[]): Promise<void> {
    await Promise.all(users.map(this.getTestsTaken))
  }

  private async getTestsAdministeredForUsers(users: AllUserSchema[]): Promise<void> {
    await Promise.all(users.map(this.getTestsAdministered))
  }

  private async getBookings(user: AllUserSchema) {
    user.bookings = await this.bookingService.getBookingsForIdList(user.bookingsIds, this.bookingParams)
  }

  private getTestsTaken = async (user: AllUserSchema) => {
    user.testsTaken = await this.testService.getTestsForIdList(user.testsTakenIds, this.testParams)
  }

  private getTestsAdministered = async (user: AllUserSchema) => {
    user.testsAdministered = await this.testService.getTestsForIdList(user.testsAdministeredIds, this.testParams)
  }
}

export const userServiceInstance = new UserService()