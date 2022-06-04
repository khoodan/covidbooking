import { Booking } from "../model/booking/Booking";
import { BookingCaretaker } from "../model/booking/BookingCaretaker";
import { BookingCollection } from "../model/booking/BookingCollection";
import { TestSite } from "../model/location/TestSite";
import { Person } from "../model/user/Person";

/**
 * BookingPresenter
 * Defines the data and methods available to the application for Bookings
 */
export interface BookingPresenter {
  /**
   * Getter for bookings
   */
  get bookings(): BookingCollection | undefined
  /**
   * Creates a Booking from user-entered data.
   * @param {Person} customer has to be Person to make a booking for
   * @param {TestSite} testingSite of booking
   * @param {string} startTime of booking
   * @param {notes} notes of booking
   * @post updates the bookings
   */
  createBooking(customer: Person, testingSite: TestSite, startTime: string, notes: string): Promise<void>
  /**
   * Updates a booking in the server
   * @param booking booking to update
   * @param caretaker caretaker of this booking's momentos
   * @post updates booking in the API
   */
  updateBooking(booking: Booking, caretaker: BookingCaretaker): Promise<void>
  /**
   * Deletes a booking from the server
   * @param booking booking to delete
   * @post deletes booking from the API
   */
  deleteBooking(booking: Booking): Promise<void>
  /**
   * Cancels a booking in the server
   * @param booking booking to cancel
   * @post cancels booking in the API
   */
  cancelBooking(booking: Booking): Promise<void>
  /**
   * Provides a kit for a given booking
   * @param {Booking} booking to provide kit
   * @post updates booking to have kit
   */
  provideKitForBooking(booking: Booking): Promise<void>
  /**
   * Finds if a verifiable is present in a booking
   * @param query bookingId or PIN to check for
   */
  verifyVerifiable(query: string): Promise<Booking>;
  /**
   * Edits a booking
   * @param bookingId id of the booking
   * @param testSite updated test site
   * @param startTime updated start time
   */
  editBooking(bookingId: string, testSite: TestSite, startTime: Date): Promise<void>
}