import { APIStatus } from "../client/APIStatus"
import { TestSite } from "../location/TestSite"
import { NotificationCollection } from "../notification/NotificationCollection"
import { Test } from "../test/Test"
import { Person } from "../user/Person"
import { VerifiableFactory } from "../verification/factory/VerifiableFactory"
import { PIN } from "../verification/PIN"
import { Verifiable } from "../verification/Verifiable"
import { VerifiableType } from "../verification/VerifiableType"
import { BookingStatus } from "./BookingStatus"


/**
 * Booking class
 * Holds information and functionality about a singular Booking
 */
export class Booking {
  /**
   * The verifiable for this Booking
   */
  private verifiable: Verifiable | undefined;
  /**
   * Whether this booking is a homebooking
   */
  private homeBooking: boolean;
  /**
   * Whether the patient provides their own kit
   */
  private patientHasOwnKit: boolean;
  /**
   * Whether the testing people have provided a kit
   */
  private kitProvided: boolean;
  /**
   * BookingID
   */
  private bookingId?: string
  /**
   * CovidTests
   */
  private covidTests?: Test[]
  /**
   * Notes
   */
  private notes?: string
  /**
   * Customer of the booking
   */
  private customer?: Person
  /**
   * TestSite of the Booking
   */
  private testSite?: TestSite
  /**
   * Notifications for this booking
   */
  private notifications: NotificationCollection

  /**
   * Creates booking
   * @param startTime start time of booking
   * @param status status of booking
   * @param additionalInfo additional info for booking
   */
  constructor(
    private startTime: string,
    private status: BookingStatus,
    additionalInfo?: any,
  ) {
    // Default sets
    this.homeBooking = false;
    this.patientHasOwnKit = false
    this.kitProvided = false
    this.setAdditionalInfo(additionalInfo)
    this.notifications = new NotificationCollection()
  }

  /**
   * Getter for notifications
   */
  getNotificationsCollection(): NotificationCollection {
    return this.notifications
  }

  /**
   * Creates a verifiable for a PIN
   * @param pin 
   */
  setPIN(pin: string) {
    this.verifiable = new PIN(pin)
  }

  /**
   * Sets additional info
   * @param additionalInfo 
   */
  private setAdditionalInfo(additionalInfo: any): void {
    if (additionalInfo) {
      // Check is homebooking
      if (additionalInfo.homeBooking) {
        this.homeBooking = !!additionalInfo.homeBooking;
        this.patientHasOwnKit = !!additionalInfo.patientHasOwnKit;
        this.kitProvided = !!additionalInfo.kitProvided;

        // QR information
        this.generateVerifiable(VerifiableType.QR)
        if (additionalInfo.QR) {
          // Set verifiable information
          this.getVerifiable()?.setVerifiable(additionalInfo.QR)
        }
      }
    }
  }

  /**
   * Generates a verifiable 
   * @param type generates this type of verifiable
   */
  generateVerifiable(type: VerifiableType): Verifiable {
    this.verifiable = VerifiableFactory.instance.createVerifiable(type)
    return this.verifiable
  }

  /**
   * Checks whether the Booking has a given status.
   * @param status status to check for 
   * @returns true if has
   */
  hasStatus(status: BookingStatus): boolean {
    return this.status == status
  }

  /**
   * Returns the status of the booking
   * @returns {BookingStatus} status of the booking
   */
  getStatus(): BookingStatus {
    return this.status;
  }

  /**
   * Setter for the status of the booking
   * @param status
   */
  setStatus(status: BookingStatus): void {
    this.status = status;
  }

  /**
   * Gets user id.
   * @returns {string}} user id
   */
  getUserId(): string {
    if (!this.customer) throw new Error(APIStatus.NOTFOUND)
    return this.customer.getId()
  }

  /**
   * Gets testing site id.
   * @returns {string} testing site  id
   */
  getTestingSiteId(): string {
    if (!this.testSite) throw new Error(APIStatus.NOTFOUND)
    return this.testSite.getId()
  }

  /**
   * Setter for the start time
   * @param startTime start time
   * @post sets start time  
   */
   setStartTime(startTime: string): void {
    this.startTime = startTime
  }

  /**
   * Gets start time
   * @returns {string} testing site  id
   */
  getStartTime(): string {
    return this.startTime
  }

  /**
   * Gets notes.
   * @returns {string}} notes
   */
  getNotes(): string {
    return (this.notes != null) ? this.notes : ""
  }

  /**
   * Returns the Verifiable
   */
  getVerifiable(): Verifiable | undefined {
    return this.verifiable
  }

  /**
   * Tells whether the booking will be at home
   */
  getIsHomeBooking(): boolean {
    return this.homeBooking
  }

  /**
   * Tells whether the patient will provide their own test kit
   */
  getPatientHasOwnKit(): boolean {
    return this.patientHasOwnKit
  }

  /**
   * Tells whether the patient has had a kit provided
   */
  getKitProvided(): boolean {
    return this.kitProvided
  }

  /**
   * Retrieve booking ID
   * @returns {string}
   */
  getId(): string {
    return this.bookingId as string
  }

  /**
   * Provides a RAT kit if not already given
   */
  provideKit(): void {
    if (this.kitProvided || this.patientHasOwnKit) throw new Error(APIStatus.ERROR)
    this.kitProvided = true
  }

  /**
   * Setter for the testing site
   * @param testSite test site
   * @post sets testing site
   */
  setTestingSite(testSite: TestSite): void {
    this.testSite = testSite
  }

  /**
   * Getter for Testing Site
   * @returns {TestSite}
   */
  getTestingSite(): TestSite {
    if (!this.testSite) throw new Error(APIStatus.NOTFOUND)
    return this.testSite
  }

  /**
   * Setter for the customer
   * Useful when the booking API does not provide the customer
   * @param user 
   * @post sets customer
   */
  setCustomer(user: Person): void {
    this.customer = user
  }

  /**
   * Setter for bookingId
   * @param id 
   */
  setBookingId(id: string) {
    this.bookingId = id;
  }

  /**
   * Setter for covid tests
   * @param tests 
   */
  setCovidTests(tests: Test[]) {
    this.covidTests = tests;
  }

  /**
   * Setter for notes
   * @param notes 
   */
  setNotes(notes: string) {
    this.notes = notes;
  }

  /**
   * Getter for covid tests
   * @returns tests
   */
  getCovidTests(): Test[] {
    if (!this.covidTests) throw new Error(APIStatus.NOTFOUND)
    return this.covidTests
  }

  /**
   * Getter for customer
   */
  getCustomer(): Person {
    if (!this.customer) throw new Error(APIStatus.NOTFOUND)
    return this.customer;
  }

  /**
   * Creates a snapshot of the current booking state and stores it
   * @returns BookingMemento the booking snapshot
   */
   makeSnapshot(): BookingMemento {
    // Create snapshot
    const bookingMemento = new BookingMemento(
      this.startTime,
      this.status,
      this.homeBooking,
      this.patientHasOwnKit,
      this.kitProvided,
      this.testSite,
      this.notes)
    return bookingMemento
  }

  /**
   * Restores some previous state of this booking
   * @returns BookingMemento the booking snapshot to restore
   */
  restoreBookingSnapshot(bookingSnapshot: BookingMemento) {
    this.startTime = bookingSnapshot.startTime
    this.status = bookingSnapshot.status
    this.homeBooking = bookingSnapshot.homeBooking
    this.patientHasOwnKit = bookingSnapshot.patientHasOwnKit
    this.kitProvided = bookingSnapshot.kitProvided
    this.testSite = bookingSnapshot.testingSite
    this.notes = bookingSnapshot.notes
  }
}

export class BookingMemento {
  /**
   * Creates a booking memento
   * @param startTime start time of booking
   * @param status status of booking
   * @param notes any booking notes
   * @param customer customer whom to create booking for
   * @param testSite test site to get tested at
   * @param additionalInfo additional info for booking
   * @param smsPin sms pin if given
   * @param bookingId id of the booking
   * @param covidTests any related covid tests
   */
  constructor(
    public startTime: string,
    public status: BookingStatus,
    public homeBooking: boolean,
    public patientHasOwnKit: boolean,
    public kitProvided: boolean,
    public testingSite?: TestSite,
    public notes?: string,
  ) {
    testingSite?.setBookings([])
    testingSite?.getNotificationsCollection().setNotifications([])
  }

  /**
   * Returns the start time
   * @returns
   */
  viewStartTime(): string {
    return this.startTime
  }
}