import { Booking, BookingMemento } from "../../booking/Booking";
import { BookingCaretaker } from "../../booking/BookingCaretaker";
import { BookingCollection } from "../../booking/BookingCollection";
import { BookingCreator } from "../../booking/factory/BookingCreator";
import { NotificationCreator } from "../../notification/factory/NotificationCreator";
import { TestSiteCreator } from "../../location/factory/TestSiteCreator";
import { BookingClient } from "../BookingClient";
import { AxiosClient } from "./AxiosClient";

/**
 * AxiosBookingClient
 * Implementation of BookingClient to get user data from API
 */
export class AxiosBookingClient extends AxiosClient implements BookingClient {

  /**
   * Creates a client with the /user path
   */
  constructor() {
    super('/booking')
  }
  /**
   * Gets bookings from API and converts them into Booking instances
   * @returns List of Bookings
   */
  public async getBookings(): Promise<BookingCollection> {
    const rawBookingData = await this.client.get('/')
    const bookingData: any[] = rawBookingData.data
    const creator = new BookingCreator()

    const bookingCollection = new BookingCollection([])

    const bookings: Booking[] = []
    bookingData.forEach(rawBooking => {
      const booking = creator.createBooking(rawBooking)
      bookings.push(booking)

      let caretaker: BookingCaretaker
      if (rawBooking.additionalInfo.snapshots && rawBooking.additionalInfo.snapshots.length) {

        // Create booking mementos
        const bookingMementos: BookingMemento[] = []
        const snapshotData: any[] = rawBooking.additionalInfo.snapshots
        snapshotData.forEach(rawSnapshot => {
          // Create test site
          const creator = new TestSiteCreator()
          const testingSite = creator.createTestSite(rawSnapshot.testingSite)
          bookingMementos.push(new BookingMemento(
            rawSnapshot.startTime,
            rawSnapshot.status,
            rawSnapshot.homeBooking,
            rawSnapshot.patientHasOwnKit,
            rawSnapshot.kitProvided,
            testingSite,
            rawSnapshot.notes)
          )
        })
        // Create caretaker
        caretaker = new BookingCaretaker(booking, bookingMementos)
      } else {
        // No snapshots or mementos      
        caretaker = new BookingCaretaker(booking, [])
      }
      bookingCollection.setCaretaker(booking.getId(), caretaker)
    })
    bookingCollection.setBookings(bookings)

    return bookingCollection
  }

  /**
   * Posts a booking to API
   * @param booking booking to post
   * @param caretaker caretaker of booking's momentos
   */
  async postBooking(booking: Booking, caretaker: BookingCaretaker): Promise<void> {
    await this.client.post('/', this.generatePostData(booking, caretaker))
  }

  /**
   * Updates a booking in the API
   * @param booking to update
   * @param caretaker caretaker of booking's momentos
   */
  async updateBooking(booking: Booking, caretaker: BookingCaretaker): Promise<void> {
    await this.client.patch(`/${booking.getId()}`, this.generatePostData(booking, caretaker))
  }

  /**
   * Generates data in a format for the API
   * @param booking booking to format for the API
   * @param caretaker caretaker of booking's momentos
   */
  private generatePostData(booking: Booking, caretaker: BookingCaretaker): any {
    const postData = {
      customerId: booking.getUserId(),
      testingSiteId: booking.getTestingSiteId(),
      startTime: booking.getStartTime(),
      notes: booking.getNotes(),
      status: booking.getStatus(),
      additionalInfo: {}
    }

    // Add snapshot data
    postData.additionalInfo = { snapshots: caretaker.getHistory() }

    // Add additional info if the booking has QR
    if (booking.getIsHomeBooking()) {
      postData.additionalInfo = {
        ...postData.additionalInfo,
        // Home booking information
        homeBooking: booking.getIsHomeBooking(),
        patientHasOwnKit: booking.getPatientHasOwnKit(),
        kitProvided: booking.getKitProvided(),
        QR: booking.getVerifiable()?.string()
      }
    }

    // Add notifications
    const notificationCreator = new NotificationCreator()
    postData.additionalInfo = {
      ...postData.additionalInfo,
      notifications: booking.getNotificationsCollection().getNotifications().map(notification => notificationCreator.createRawNotification(notification))
    }

    return postData
  }

  /**
   * Deletes a booking from the API
   * @param booking booking to delete
   */
  async deleteBooking(booking: Booking): Promise<void> {
    await this.client.delete(`/${booking.getId()}`)
  }

  /**
   * Cancels a booking in the API
   * @param booking booking to cancel
   */
  async cancelBooking(booking: Booking): Promise<void> {
    await this.client.patch(`/${booking.getId()}`, { status: booking.getStatus() })
  }
}