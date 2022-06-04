import { BookingCreator } from "../../booking/factory/BookingCreator";
import { CovidTestSchema } from "../../client/schema/CovidTestSchema";
import { UserSchema } from "../../client/schema/UserSchema";
import { TestFactory } from "../../test/factory/TestFactory";
import { Person } from "../Person";
import { UserCreator } from "./UserCreator";

/**
 * Person Creator implementation of the UserCreator
 */
export class PersonCreator implements UserCreator {
  /**
   * Booking Creator instance
   */
  private bookingCreator = new BookingCreator()

  /**
   * Creates a person
   * @param personData data from API
   * @returns {Person}
   */
  createUser(personData: UserSchema) {    
    const { id, givenName, familyName, userName, phoneNumber, additionalInfo, isCustomer, isReceptionist, isHealthcareWorker } = personData;

    // Create Person object for each user
    let person = new Person(
      id as string,
      givenName as string,
      familyName as string
    )
    person.setUserName(userName as string)
    person.setPhoneNumber(phoneNumber as string)
    person.setAdditionalInfo(additionalInfo)
    person.setCustomer(isCustomer as boolean)
    person.setReceptionist(isReceptionist as boolean)
    person.setHealthcareWorker(isHealthcareWorker as boolean)

    // Create and set bookings, testsTaken and testsAdministered if they exist
    const bookings = personData.bookings?.map((booking: any) => booking && this.bookingCreator.createBooking(booking))
    const testsTaken = personData.testsTaken?.map((test: CovidTestSchema) => test && TestFactory.instance.createTest(test))
    const testsAdministered = personData.testsAdministered?.map((test: CovidTestSchema) => test && TestFactory.instance.createTest(test))
    person.setBookings(bookings)
    person.setTestsTaken(testsTaken)
    person.setTestsAdministered(testsAdministered)

    return person
  }
}