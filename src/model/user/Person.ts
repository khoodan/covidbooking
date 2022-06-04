import { Booking } from "../booking/Booking";
import { APIStatus } from "../client/APIStatus";
import { Test } from "../test/Test";
import { User } from "./User";
import { UserType } from "./UserType";

/**
 * Person
 * User Implementation
 * Provides general methods for every Person
 */
export class Person implements User {
  /**
   * The person type
   */
  protected personTypes: Set<UserType>;
  /**
   * Login user name
   */
  protected userName?: string;
  /**
   * Phone number
   */
   protected phoneNumber?: string;
  /**
   * Whether person is a customer 
   */
   protected isCustomer?: boolean;
  /**
   * Whether person is a receptionist 
   */
   protected isReceptionist?: boolean;
  /**
   * Whether person is a healthcareWorker 
   */
   protected isHealthcareWorker?: boolean;
  /**
   * Bookings belonging to this person 
   */
   protected bookings?: Booking[];
  /**
   * Tests undertaken by this person 
   */
   protected testsTaken?: Test[];
  /**
   * Tests administered by this person 
   */
     protected testsAdministered?: Test[];
  /**
   * Any extra information about person
   */
   protected additionalInfo: any;

  /**
   * Creates Person  
   * @param {string} id id of person
   * @param {string} givenName given name of person
   * @param {string} familyName last name of person 
   */
  constructor(
    protected id: string,
    protected givenName: string,
    protected familyName: string
  ) {
    this.personTypes = new Set<UserType>();    
  }

  /**
   * Capitalises a word
   * @param word to capitalise
   * @returns {string} capitalised word
   */
  private capitalise(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  /**
   * Gets display string of user
   * @returns {string} display string for user
   */
  display(): string {
    return `${this.capitalise(this.givenName)} ${this.capitalise(this.familyName)}`
  }

  /**
   * Gets user id
   * @returns {string} user id
   */
   getId(): string {
    return this.id
  }

  /**
   * Gets given name
   * @returns {string} given name
   */
   getGivenName(): string {
    return this.givenName;
  }

  /**
   * Gets family name
   * @returns {string} family name
   */
  getFamilyName(): string {
    return this.familyName;
  }

  /**
   * Sets user name
   * @param givenName
   */
   setUserName(userName: string): void {
    this.userName = userName;
  }

  /**
   * Gets user name
   * @returns {string} username
   */
  getUsername(): string {
    if (!this.userName) throw new Error(APIStatus.NOTFOUND)
    return this.userName;
  }

  /**
   * Sets phone number
   * @param phoneNumber
   */
   setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }

  /**
   * Gets phone number
   */
  getPhoneNumber(): string {
    if (!this.phoneNumber) throw new Error(APIStatus.NOTFOUND)
    return this.phoneNumber
  }

  /**
   * Sets additional info
   */
   setAdditionalInfo(additionalInfo: any): void {
    this.additionalInfo = additionalInfo
  }

  /**
   * Sets customer type to the personTypes set
   * @param isCustomer
   */
   setCustomer(isCustomer: boolean): void {
    if (isCustomer) this.personTypes.add(UserType.CUSTOMER)
  }

  /**
   * Sets receptionist type to the personTypes set
   * @param isCustomer
   */
   setReceptionist(isReceptionist: boolean): void {
    if (isReceptionist) this.personTypes.add(UserType.RECEPTIONIST)
  }

  /**
   * Sets healthcare worker type to the personTypes set
   * @param isCustomer
   */
   setHealthcareWorker(isHealthcareWorker: boolean): void {
    if (isHealthcareWorker) this.personTypes.add(UserType.HEALTHCAREWORKER)
  }

  /**
   * Checks whether this user has a specific type
   * @param type to check
   * @returns {boolean} true if has
   */
  hasType(type: UserType): boolean {
    return this.personTypes.has(type);
  }

  /**
   * Sets bookings
   */
  setBookings(bookings: Booking[]): void {
    this.bookings = bookings
  }

  /**
   * Sets the tests undertaken by person
   */
   setTestsTaken(testsTaken: Test[]): void {
    this.testsTaken = testsTaken
  }

  /**
   * Sets the tests administered by person
   */
   setTestsAdministered(testsAdministered: Test[]): void {
    this.testsAdministered = testsAdministered
  }

  /**
   * Get bookings if exist
   */
  getBookings(): Booking[] {
    if (!this.bookings) throw new Error(APIStatus.NOTFOUND)
    return this.bookings
  }
}