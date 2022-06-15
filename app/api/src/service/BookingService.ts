import { AllBookingSchema, BookingSchema } from "@schema/BookingSchema";
import { DynamoBookingClient } from "src/client/aws/DynamoBookingClient";
import { BookingClient } from "src/client/BookingClient";
import { DataService } from "./DataService";
import { GetTestParams, testService } from "./TestService";
import { GetUserParams, userService } from "./UserService";

export interface GetBookingParams {
  includeUser?: boolean;
  includeTestSite?: boolean;
  includeCovidTests?: boolean;
}

export class BookingService extends DataService {
  private bookingClient: BookingClient = new DynamoBookingClient();

  private static testParams: GetTestParams = {
    includeAdministerer: true,
    includeBooking: false,
    includePatient: true
  }

  private static userParams: GetUserParams = {
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

    if (includeUser) {}

    if (includeCovidTests) {
      await testService.getTestsForIdList(booking.covidTestIds, {
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
    booking.covidTests = await testService.getTestsForIdList(booking.covidTestIds, BookingService.testParams)
  }

  private async getUserForBooking(booking: AllBookingSchema): Promise<void> {
    booking.customer = await userService.getUserById(booking.customerId, BookingService.userParams)
  }
}

export const bookingService = new BookingService()