import { Booking } from "../booking/Booking";
import { APIStatus } from "../client/APIStatus";
import { TestSite } from "../location/TestSite";
import { NotificationType } from "./NotificationType";

/**
 * Notification Class
 * Used when bookings are modified
 */
export class Notification {
  /**
   * TestSiteID
   */
  private testSiteId?: string;
  /**
   * Booking for this Notification
   */
  private booking?: Booking
  /**
   * Test Site for this notification
   */
  private testSite?: TestSite

  /**
   * Constructor for notification
   * @param bookingId id of booking
   * @param date date and time of notification
   * @param type type of notification
   */
  constructor(
    private bookingId: string,
    private date: Date,
    private type: NotificationType
  ) { }

  /**
   * Setter for test site id 
   * @param id
   */
  setTestSiteId(id: string) {
    this.testSiteId = id;
  }

  /**
   * Setter for booking 
   * @param booking
   */
  setBooking(booking: Booking) {
    this.booking = booking;
  }

  /**
   * Setter for testSite 
   * @param testSite
   */
  setTestsite(testSite: TestSite) {
    this.testSite = testSite;
  }

  /**
   * Getter for booking id
   */
  getBookingId(): string {
    return this.bookingId
  }

  /**
   * Getter for date
   */
  getDate(): Date {
    return this.date
  }

  /**
   * Getter for type
   */
  getType(): NotificationType {
    return this.type
  }

  /**
   * Getter for testSite id
   */
  getTestSiteId(): string {
    return this.testSiteId || ''
  }

  /**
   * Getter for booking
   */
  getBooking(): Booking | undefined {
    if (this.booking) return this.booking
  }

  /**
   * Getter for testSite
   */
  getTestSite(): TestSite {
    if (!this.testSite) throw new Error(APIStatus.NOTFOUND)
    return this.testSite
  }
}