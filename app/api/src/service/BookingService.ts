import { AllBookingSchema, BookingDBSchema, BookingSchema } from "@schema/BookingSchema";
import { DynamoBookingClient } from "src/client/aws/DynamoBookingClient";
import { BookingClient } from "src/client/BookingClient";
import { DataService } from "./DataService";
import { GetTestParams, TestService } from "./TestService";
import { GetUserParams, UserService } from "./UserService";

export interface GetBookingParams {
  includeUser?: boolean;
  includeTestSite?: boolean;
  includeCovidTests?: boolean;
}

export class BookingService extends DataService {
  private bookingClient: BookingClient = new DynamoBookingClient();
  private testService: TestService = new TestService()
  private userService: UserService = new UserService()

  private testParams: GetTestParams = {
    includeAdministerer: true,
    includeBooking: false,
    includePatient: true
  }

  private userParams: GetUserParams = {
    includeBookings: false,
    includeTestsAdministered: true,
    includeTestsTaken: true
  }

  async getBookings({
    includeUser = true,
    includeTestSite = true,
    includeCovidTests = true
  }: GetBookingParams): Promise<BookingSchema[]> {
    const bookings = await this.bookingClient.getBookings() as AllBookingSchema[]
    const promises: Promise<any>[] = []
    if (includeUser) promises.push(this.getDataForItem(bookings, this.getUserForBooking))
    if (includeCovidTests) promises.push(this.getDataForItem(bookings, this.getTestsForBooking))
    await Promise.all(promises)
    return bookings
  }

  async getBookingsForId(bookingId: string, {
    includeUser = true,
    includeTestSite = true,
    includeCovidTests = true
  }: GetBookingParams): Promise<BookingSchema> {
    const booking: AllBookingSchema = await this.bookingClient.getBookingForId(bookingId);

    if (includeCovidTests) {
      await this.testService.getTestsForIdList(booking.covidTestIds, {
        includePatient: includeUser,
        includeAdministerer: includeUser,
        includeBooking: false
      })
    }

    return booking
  }

  getBookingsForIdList(bookingIdList: string[], params: GetBookingParams): Promise<BookingSchema[]> {
    return Promise.all(bookingIdList.map(bookingId => this.getBookingsForId(bookingId, params)))
  }

  private async getTestsForBooking(booking: AllBookingSchema): Promise<void> {
    booking.covidTests = await this.testService.getTestsForIdList(booking.covidTestIds, this.testParams)
  }

  private async getUserForBooking(booking: AllBookingSchema): Promise<void> {
    booking.customer = await this.userService.getUserById(booking.customerId, this.userParams)
  }
}