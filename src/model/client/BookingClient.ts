import { Booking } from "../booking/Booking";
import { BookingCaretaker } from "../booking/BookingCaretaker";
import { BookingCollection } from "../booking/BookingCollection";

/**
 * BookingClient
 * Provides functionality for getting booking data from API
 */
export interface BookingClient {
  /**
   * Get bookings from API
   * @return {Promise<BookingCollection>} bookings
   */
  getBookings(): Promise<BookingCollection>;
  /**
   * Posts a booking to API
   * @param booking booking to post
   */
  postBooking(booking: Booking, caretaker: BookingCaretaker): Promise<void>
  /**
   * Updates a booking in the API
   * @param booking booking to update
   */
  updateBooking(booking: Booking, caretaker: BookingCaretaker): Promise<void>
  /**
   * Deletes a booking from the API
   * @param booking booking to delete
   */
  deleteBooking(booking: Booking): Promise<void>
  /**
   * Cancels a booking in the API
   * @param booking booking to cancel
   */
  cancelBooking(booking: Booking): Promise<void>
}