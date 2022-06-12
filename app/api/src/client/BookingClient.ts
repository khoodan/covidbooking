import { BookingDBSchema, CreateBookingSchema } from "@schema/BookingSchema";

export interface BookingClient {
  getBookings(): Promise<BookingDBSchema[]>
  addBooking(booking: CreateBookingSchema): Promise<void>
  getBookingForId(bookingId: string): Promise<BookingDBSchema>
}