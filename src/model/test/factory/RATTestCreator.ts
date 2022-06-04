import { BookingCreator } from "../../booking/factory/BookingCreator";
import { CovidTestSchema } from "../../client/schema/CovidTestSchema";
import { UserFactory } from "../../user/factory/UserFactory";
import { RATTest } from "../RATTest";
import { TestCreator } from "./TestCreator";

/**
 * RAT Test Creator implementation of the Test Creator
 */
export class RATTestCreator implements TestCreator {
  /**
   * Creates a RAT test
   * @param testData data from API
   * @returns {RATTest}
   */
  createTest(testData: CovidTestSchema) {
    // Create booking
    const booking = testData.booking && new BookingCreator().createBooking(testData.booking)

    return new RATTest(
      testData.result,
      testData.status,
      testData.notes,
      UserFactory.instance.createUser(testData.patient),
      UserFactory.instance.createUser(testData.administerer),
      booking
    )
  }
}