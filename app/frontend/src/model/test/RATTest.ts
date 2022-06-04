import { Booking } from "../booking/Booking";
import { User } from "../user/User";
import { ResultType } from "./result/ResultType";
import { Test } from "./Test";
import { TestType } from "./TestType";

/**
 * RATTest Implementation
 * Has functionality to do with RAT tests
 */
export class RATTest extends Test {
  /**
   * Initialises the Test
   * @param patient patient of test
   * @param administerer test administerer
   * @param bookingId id of the booking
   * @param result result of the test
   * @param status status of the test
   * @param notes any relevant notes
   */
  constructor(
    result: ResultType,
    status: string,
    notes: string,
    patient?: User,
    administerer?: User,
    booking?: Booking
  ) {
    super(TestType.RAT, patient, administerer, result, status, notes, booking)
  }

  /**
   * Returns wait time in minutes
   * @returns 30 minutes
   */
  override getWaitTime(): number {
    return 30
  }
}