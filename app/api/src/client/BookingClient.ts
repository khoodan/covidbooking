import { BookingSchema } from "@schema/BookingSchema";

export interface BookingClient {
  getBookings(): Promise<BookingSchema[]>
  addBooking(booking: BookingSchema): Promise<void>
}