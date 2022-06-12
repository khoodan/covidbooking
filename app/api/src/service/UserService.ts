import { Status } from "@schema/Status";
import { AllUserSchema, CreateUserSchema, UserDBSchema, UserSchema } from "@schema/UserSchema";
import { randomUUID } from "crypto";
import { DynamoUserClient } from "src/client/aws/DynamoUserClient";
import { UserClient } from "src/client/UserClient";
import { BookingService } from "./BookingService";

export interface GetUserParams {
  includeBookings?: boolean;
  includeTestsTaken?: boolean;
  includeTestsAdministered?: boolean;
}

export class UserService {
  userClient: UserClient = new DynamoUserClient()
  bookingService: BookingService = new BookingService()

  async getUsers({
    includeBookings = true,
    includeTestsTaken = true,
    includeTestsAdministered = true
  }: GetUserParams): Promise<UserSchema[]> {
    const users = await this.userClient.getUsers() as AllUserSchema[]

    if (includeBookings) {
      await this.getBookingsForUsers(users)
    }

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

  private async getBookingsForUsers(users: AllUserSchema[]): Promise<void> {
    await Promise.all(users.map(async (user) => {
      user.bookings = await this.bookingService.getBookingsForIdList(user.bookingsIds, {})
    }))
  }
}