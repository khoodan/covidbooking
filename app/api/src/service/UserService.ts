import { Status } from "@schema/Status";
import { AllUserSchema, CreateUserSchema, UserDBSchema, UserSchema } from "@schema/UserSchema";
import { randomUUID } from "crypto";
import { DynamoUserClient } from "src/client/aws/DynamoUserClient";
import { UserClient } from "src/client/UserClient";
import { bookingService } from "./BookingService";
import { testService } from "./TestService";

export interface GetUserParams {
  includeBookings?: boolean;
  includeTestsTaken?: boolean;
  includeTestsAdministered?: boolean;
}

export class UserService {
  private userClient: UserClient = new DynamoUserClient()

  private static bookingParams = {
    includeUser: false,
    includeCovidTests: false,
    includeTestSite: true
  }

  private static testParams = {
    includePatient: true,
    includeAdministerer: true,
    includeBooking: false
  }

  async getUsers({
    includeBookings = true,
    includeTestsTaken = true,
    includeTestsAdministered = true
  }: GetUserParams): Promise<UserSchema[]> {
    // console.log(userService, testService, bookingService, testSiteService)
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

    const userDB: UserDBSchema = user
    userDB.id = randomUUID()
    userDB.bookingsIds = []
    userDB.testsTakenIds = []
    userDB.testsAdministeredIds = []

    return this.userClient.addUser(userDB)
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
    console.log(user)
    user.bookings = await bookingService.getBookingsForIdList(user.bookingsIds, UserService.bookingParams)
  }

  private getTestsTaken = async (user: AllUserSchema) => {
    user.testsTaken = await testService.getTestsForIdList(user.testsTakenIds, UserService.testParams)
  }

  private getTestsAdministered = async (user: AllUserSchema) => {
    user.testsAdministered = await testService.getTestsForIdList(user.testsAdministeredIds, UserService.testParams)
  }
}

export const userService = new UserService()