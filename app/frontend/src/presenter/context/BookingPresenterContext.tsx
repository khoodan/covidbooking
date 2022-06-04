import React, { useContext } from "react";
import { Booking } from "../../model/booking/Booking";
import { BookingCaretaker } from "../../model/booking/BookingCaretaker";
import { BookingStatus } from "../../model/booking/BookingStatus";
import { APIStatus } from "../../model/client/APIStatus";
import { AxiosClientManager } from "../../model/client/axios/AxiosClientManager";
import { TestSite } from "../../model/location/TestSite";
import { Notification } from "../../model/notification/Notification";
import { NotificationType } from "../../model/notification/NotificationType";
import { Person } from "../../model/user/Person";
import { BookingPresenter } from "../BookingPresenter";
import { BookingDataLayer } from "../DataLayer";
import { DataLayerContext } from "./DataLayerContext";

/**
 * Context for BookingPresenter
 */
const BookingPresenterContext = React.createContext<BookingPresenter>({} as BookingPresenter)

/**
 * Provider for the BookingPresenter
 * Allows the application to access the methods and data of the BookingPresenter
 */
class BookingPresenterProviderWithoutData extends React.Component<BookingDataLayer> {
  /**
  * Constructor for the Provider
  * Initialises the Provider
  */
  constructor(props: React.PropsWithChildren<BookingDataLayer>) {
    super(props)

    this.getBookings = this.getBookings.bind(this);
    this.createBooking = this.createBooking.bind(this);
    this.updateBooking = this.updateBooking.bind(this);
    this.deleteBooking = this.deleteBooking.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);
    this.verifyVerifiable = this.verifyVerifiable.bind(this);
    this.editBooking = this.editBooking.bind(this);
  }

  /**
   * Runs when we need to update data
   */
  componentDidUpdate(prevProps: BookingDataLayer) {
    if (prevProps.bookingsUpdater != this.props.bookingsUpdater) {
      this.getBookings()
    }
  }

  /**
   * Gets required information when loaded
   */
  componentDidMount() {
    this.getBookings()
  }

  /**
   * Gets bookings from API through API client
   * Sets the bookings in the DataLayer
   */
  getBookings(): Promise<void> {
    return AxiosClientManager.instance.booking.getBookings()
      .then(bookings => this.props.setBookings(bookings))
  }

  /**
   * Creates a Booking from user-entered data.
   * @param {Person} customer has to be Person to make a booking for
   * @param {TestSite} testingSite of booking
   * @param {string} startTime of booking
   * @param {notes} notes of booking
   * @post updates the bookings
   */
  async createBooking(customer: Person, testingSite: TestSite, startTime: string, notes: string): Promise<void> {
    // Check that the booking start time is after now
    if (startTime < new Date().toISOString()) throw new Error(APIStatus.BADREQUEST)

    // Create the booking
    const booking = new Booking(startTime, BookingStatus.INITIATED)
    booking.setNotes(notes)
    booking.setCustomer(customer)
    booking.setTestingSite(testingSite)

    // Add notification
    const notification = new Notification(booking.getId(), new Date(), NotificationType.CREATE)
    booking.getNotificationsCollection().addNotification(notification)

    await AxiosClientManager.instance.booking.postBooking(booking, new BookingCaretaker(booking, []))

    // Update bookings and users
    this.props.updateAllData()
  }

  /**
   * Updates a booking in the server
   * @param booking booking to update
   * @param caretaker caretaker of this booking's momentos
   * @post updates booking in the API
   */
  async updateBooking(booking: Booking, caretaker: BookingCaretaker): Promise<void> {
    // Update booking
    const notification = new Notification(booking.getId(), new Date(), NotificationType.MODIFY)
    const bookingTestSite = booking.getTestingSite()
    booking.getNotificationsCollection().addNotification(notification)
    await Promise.all([
      AxiosClientManager.instance.booking.updateBooking(booking, caretaker),
      AxiosClientManager.instance.testSite.updateTestSiteNotifications(bookingTestSite)
    ])
    this.props.updateAllData()
  }

  /**
   * Deletes a booking from the server
   * @param booking booking to delete
   * @post deletes booking from the API
   */
  async deleteBooking(booking: Booking): Promise<void> {
    // Delete booking
    booking.getTestingSite().getNotificationsCollection().addNotification(new Notification(booking.getId(), new Date(), NotificationType.DELETE))
    await AxiosClientManager.instance.testSite.updateTestSiteNotifications(booking.getTestingSite())
    await AxiosClientManager.instance.booking.deleteBooking(booking)
    this.props.updateAllData()
  }

  /**
   * Cancels a booking in the server
   * @param booking booking to cancel
   * @post cancels booking in the API
   */
  async cancelBooking(booking: Booking): Promise<void> {
    // Update booking status
    booking.setStatus(BookingStatus.CANCELLED)
    booking.getNotificationsCollection().addNotification(new Notification(booking.getId(), new Date(), NotificationType.CANCEL))
    // Push to API
    await AxiosClientManager.instance.booking.cancelBooking(booking)
    this.props.updateAllData()
  }

  /**
   * Provides a kit for a given booking
   * @param {Booking} booking to provide kit
   * @post updates booking to have kit
   */
  async provideKitForBooking(booking: Booking): Promise<void> {
    // Provide kit and update
    booking.provideKit()
    booking.getNotificationsCollection().addNotification(new Notification(booking.getId(), new Date(), NotificationType.PROVIDEKIT))
    await AxiosClientManager.instance.booking.updateBooking(booking, new BookingCaretaker(booking, []))
    this.props.updateAllData()
  }

  /**
   * Finds if a verifiable is present in a booking
   * @param query bookingId or PIN to check for
   */
  verifyVerifiable(query: string): Promise<Booking> {
    // Find verifiable
    let bookingsWithVerifiable: Booking[] = this.props.bookings?.getBookingByVerifiable(query) || []

    // Check bookingId
    if (!bookingsWithVerifiable.length) {
      bookingsWithVerifiable = this.props.bookings?.getBookingById(query) || []
    }

    if (!bookingsWithVerifiable.length) {
      return Promise.reject(APIStatus.NOTFOUND)
    }

    return Promise.resolve(bookingsWithVerifiable[0])
  }

  /**
   * Edits a booking
   * @param bookingId id of the booking
   * @param testSite updated test site
   * @param startTime updated start time
   */
  async editBooking(bookingId: string, testSite: TestSite, startTime: Date): Promise<void> {
    if (!this.props.bookings) return
    const booking = this.props.bookings.getBookingById(bookingId)[0]
    const bookingCaretaker: BookingCaretaker = this.props.bookings.getBookingCaretaker(bookingId)
    const bookingTestSite = booking.getTestingSite()
    // Create snapshot if test site or start time has changed
    if (testSite != booking.getTestingSite() || startTime.toISOString() != booking.getStartTime()) {
      if (testSite != booking.getTestingSite()) {
        // Add new notification for old testing site
        bookingTestSite.getNotificationsCollection().addNotification(new Notification(booking.getId(), new Date(), NotificationType.MODIFY))
      }
      bookingCaretaker.save()
      // Update data
      booking.setTestingSite(testSite)
      booking.setStartTime(startTime.toISOString())
    }
    // Update booking
    await this.updateBooking(booking, bookingCaretaker)
  }

  /**
   * Provides the BookingPresenter
   */
  render() {
    return (
      <BookingPresenterContext.Provider value={{
        bookings: this.props.bookings,
        createBooking: this.createBooking,
        updateBooking: this.updateBooking,
        cancelBooking: this.cancelBooking,
        deleteBooking: this.deleteBooking,
        provideKitForBooking: this.provideKitForBooking,
        verifyVerifiable: this.verifyVerifiable,
        editBooking: this.editBooking
      }}>
        {this.props.children}
      </BookingPresenterContext.Provider>
    )
  }
}

/**
 * BookingPresenterProvider
 * High order component which provides the BookingPresenter with access to the DataLayer
 */
export const BookingPresenterProvider: React.FC = ({ children }) => {
  return (
    <DataLayerContext.Consumer>
      {(layer) =>
        <BookingPresenterProviderWithoutData {...layer}>
          {children}
        </BookingPresenterProviderWithoutData>
      }
    </DataLayerContext.Consumer>
  )
}

/**
 * Hook for allowing the View to use the BookingPresenter
 */
export const useBookingPresenter = () => useContext<BookingPresenter>(BookingPresenterContext)