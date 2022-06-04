import { Booking } from "../booking/Booking";
import { APIStatus } from "../client/APIStatus";
import { NotificationCollection } from "../notification/NotificationCollection";
import { Address } from "./Address";
import { TestSiteCapability } from "./TestSiteCapability";
import { TestSiteType } from "./TestSiteType";
import { WalkDriveFacility } from "./WalkDriveFacility";

/**
 * TestSite class
 * Stores information about a test site
 */
export class TestSite {
  
  /**
   * The test site's capabilities
   */
  protected capabilities: Set<TestSiteCapability>;
  /**
   * The test site options of drive-through or walk-in
   */
  protected walkDriveFacilities: Set<WalkDriveFacility>;
  /**
   * The type of test site this is
   */
  protected testSiteTypes: Set<TestSiteType>;
  /**
   * TestSite ID
   */
  private id: string;
  /**
   * TestSite Name
   */
  private name: string;
  /**
   * TestSite Phone Number
   */
  private phoneNumber?: string;
  /**
   * TestSite Address
   */
   private address?: Address
  /**
   * Bookings
   */
  protected bookings?: Booking[]
  /**
   * Notifications
   */
  private notifications: NotificationCollection

  /**
   * Initialises a TestSite
   * @param {string} name name of test site
   * @param {} additionalInfo information about test site capabilities
   * @param {string} id if of test site
   */
  constructor(
    name: string,
    private additionalInfo: {
      hasRegisterCapability: boolean,
      hasWalkFacility: boolean,
      hasDriveFacility: boolean,
      hasTestingCapability: boolean
    },
    id?: string,
  ) {
    this.id = id ? id : ""
    this.name = name

    // Set capabilities based on given
    this.capabilities = new Set()
    if (additionalInfo.hasRegisterCapability) this.capabilities.add(TestSiteCapability.BOOKING)
    if (additionalInfo.hasTestingCapability) this.capabilities.add(TestSiteCapability.TESTING)

    this.walkDriveFacilities = new Set();
    if (additionalInfo.hasWalkFacility) this.walkDriveFacilities.add(WalkDriveFacility.WALK);
    if (additionalInfo.hasDriveFacility) this.walkDriveFacilities.add(WalkDriveFacility.DRIVE);

    this.testSiteTypes = new Set();    
    this.notifications = new NotificationCollection()
  }

  /**
   * Gets testing site id
   * @returns {string} testing site id
   */
  getId(): string {
    return this.id
  }

  /**
   * Sets testing site address
   * @param givenName
   */
   setAddress(address: Address): void {
    this.address = address;
  }
  
  /**
   * Gets testing site address
   * @returns {Address} address object
   */
  getAddress(): Address {
    if (!this.address) throw new Error(APIStatus.NOTFOUND)
    return this.address
  }

  /**
   * Returns a summary of information for this test site.
   * @return {string} summarised details of this test site
   */
  get summary() {
    let summary = ""
    summary += ` Name: ${this.name},`
    summary += ` Address: ${this.address?.display},`

    if (this.walkDriveFacilities) {
      summary += ` Options: ${Array.from(this.walkDriveFacilities).join(",")}`
    }

    return summary
  }

  /**
   * Notification getter
   */
  getNotificationsCollection(): NotificationCollection {
    return this.notifications;
  }

  /**
   * Gets the TestSite name
   * @returns {string} name of the TestSite
   */
  getName(): string {
    return this.name;
  }

  /**
   * Sets testing site phone number
   * @param givenName
   */
   setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }
  
  /**
   * Gets testing site phone number
   * @returns {Address} address object
   */
  getPhoneNumber(): string {
    if (!this.phoneNumber) throw new Error(APIStatus.NOTFOUND)
    return this.phoneNumber
  }

  /**
   * Checks whether the TestSite has a given capability
   * @param capability that we are checking for
   * @returns {boolean} true if has
   */
  hasCapability(capability: TestSiteCapability): boolean {
    return this.capabilities.has(capability)
  }

  /**
   * Checks whether the TestSite has a given facility
   * @param facility facility to check for 
   * @returns true if has
   */
  hasFacility(facility: WalkDriveFacility): boolean {
    return this.walkDriveFacilities.has(facility)
  }

  /**
   * Checks whether the TestSite has a given type
   * @param type type to check for 
   * @returns true if has
   */
  hasType(type: TestSiteType): boolean {
    return this.testSiteTypes.has(type)
  }

  /**
   * Getter for bookings
   * @returns bookings of this TestSite
   */
  getBookings() {
    if (!this.bookings) throw new Error(APIStatus.NOTFOUND)
    return this.bookings
  }

  /**
   * Gets an estimated waiting time based on number of bookings
   * = 30*number of bookings
   * @returns time in minutes
   */
  getEstimatedWaitingTime(): number {
    // Simple algorithm = 30 * number of bookings
    try {
      return this.getBookings().length * 30
    } catch (err: any) {
      // No bookings so 30 minutes waiting time
      if (err.message === APIStatus.NOTFOUND) {
        return 30
      }
      else {
        throw err
      }
    }
  }

  /**
   * Setter for bookings
   * @param bookings 
   */
  setBookings(bookings: Booking[]) {
    this.bookings = bookings
  }

  /**
   * Gets notifications from bookings
   * @returns {NotificationCollection} sorted notification collection containing all notifications about this test site
   */
  getAllNotifications(): NotificationCollection {
    if (!this.bookings) throw new Error(APIStatus.NOTFOUND);
    const collection = new NotificationCollection();
    this.bookings.forEach(booking => collection.addCollection(booking.getNotificationsCollection()))
    collection.addCollection(this.notifications)
    collection.sortByDate()
    return collection
  }
}