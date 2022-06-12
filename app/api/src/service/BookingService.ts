import { AllBookingSchema, BookingDBSchema, BookingSchema } from "@schema/BookingSchema";
import { DynamoBookingClient } from "src/client/aws/DynamoBookingClient";
import { BookingClient } from "src/client/BookingClient";
import { GetTestParams, TestService } from "./TestService";

export interface GetBookingParams {
  includeUser?: boolean;
  includeTestSite?: boolean;
  includeCovidTests?: boolean;
}

export class BookingService {
  private bookingClient: BookingClient = new DynamoBookingClient();
  private testService: TestService = new TestService()

  getBookings({
    includeUser = true,
    includeTestSite = true,
    includeCovidTests = true
  }: GetBookingParams): Promise<BookingSchema[]> {
    return Promise.resolve([])
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

  private async getTestsForBookings(bookings: AllBookingSchema[], testParams: GetTestParams): Promise<void> {
    await Promise.all(bookings.map(async (booking) => {
      booking.covidTests = await this.testService.getTestsForIdList(booking.covidTestIds, testParams)
    }))
  }
}