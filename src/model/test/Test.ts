import { Booking } from "../booking/Booking";
import { User } from "../user/User";
import { Result } from "./result/Result";
import { ResultType } from "./result/ResultType";
import { TestType } from "./TestType";

/**
 * Test Class
 * Stores information about a COVID test
 */
export abstract class Test {
  /**
   * Test result
   */
  protected testResult: Result;
  /**
   * The type of test this is 
   */
  protected testType: TestType;

  /**
   * Gets the result of the Test
   */
  getResult(): string {
    return this.testResult.getResult()
  }

  /**
   * Initialises the Test
   * @param testType type of test
   * @param patientId id of patient of test
   * @param administererId id of test administerer
   * @param bookingId id of the booking
   * @param result result of the test
   * @param status status of the test
   * @param notes any relevant notes
   */
  constructor(
    testType: TestType,
    protected patient?: User,
    protected administerer?: User,
    result?: ResultType,
    protected status?: string,
    protected notes?: string,
    protected booking?: Booking
  ) {
    this.testType = testType
    this.testResult = result ? new Result(result) : new Result(ResultType.INITIATED)
  }

  /**
   * Sets the result of the test
   */
  setResult(result: ResultType): void {
    this.testResult.setResult(result)
  }

  /**
   * Getter for the type
   */
  getType() {
    return this.testType
  }

  /**
   * Getter for notes
   */
  getNotes() {
    return this.notes
  }

  /**
   * Getter for status
   */
  getStatus() {
    return this.status
  }

  /**
   * Getter for bookingId
   */
  getBookingId() {
    return this.booking?.getId()
  }

  /**
   * Getter for administererId
   */
  getAdministererId() {
    return this.administerer?.getId()
  }

  /**
  * Getter for patientId
  */
  getPatientId() {
    return this.patient?.getId()
  }

  /**
   * Gets the wait time for the Test in minutes
   */
  abstract getWaitTime(): number
}