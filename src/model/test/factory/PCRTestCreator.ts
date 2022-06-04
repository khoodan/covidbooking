import { BookingCreator } from "../../booking/factory/BookingCreator";
import { CovidTestSchema } from "../../client/schema/CovidTestSchema";
import { UserFactory } from "../../user/factory/UserFactory";
import { PCRTest } from "../PCRTest";
import { TestCreator } from "./TestCreator";

/**
 * PCR Test Creator implementation of the Test Creator
 */
export class PCRTestCreator implements TestCreator {
  /**
   * Creates a PCR test
   * @param testData data from API
   * @returns {PCRTest}
   */
  createTest(testData: CovidTestSchema) {
    // Create booking
    const booking = testData.booking && new BookingCreator().createBooking(testData.booking)

    return new PCRTest(
      testData.result,
      testData.status,
      testData.notes,
      UserFactory.instance.createUser(testData.patient),
      UserFactory.instance.createUser(testData.administerer),
      booking
    )
  }
}