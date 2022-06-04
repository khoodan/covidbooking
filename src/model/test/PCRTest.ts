import { Booking } from "../booking/Booking";
import { User } from "../user/User";
import { ResultType } from "./result/ResultType";
import { Test } from "./Test";
import { TestType } from "./TestType";

/**
 * PCRTest Implementation
 * Has functionality to do with PCR tests
 */
export class PCRTest extends Test {
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
    super(TestType.PCR, patient, administerer, result, status, notes, booking)
  }

  /**
   * Returns wait time in minutes
   * @returns 3 days wait time
   */
  override getWaitTime(): number {
    return 3 * 24 * 60;
  }
}