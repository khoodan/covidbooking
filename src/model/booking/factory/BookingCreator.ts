import { CovidTestSchema } from "../../client/schema/CovidTestSchema";
import { UserSchema } from "../../client/schema/UserSchema";
import { TestSiteCreator } from "../../location/factory/TestSiteCreator";
import { NotificationCreator } from "../../notification/factory/NotificationCreator";
import { TestFactory } from "../../test/factory/TestFactory";
import { Person } from "../../user/Person";
import { Booking } from "../Booking";

/**
 * BookingCreator
 * Creates a booking given raw data from the API
 */
export class BookingCreator {
  /**
   * Creates the Booking
   * @param rawBooking data from API
   */
  createBooking(rawBooking: any): Booking { 
    // Create Booking objects for each booking retrieved
    let booking = new Booking(
      rawBooking.startTime,
      rawBooking.status,
      rawBooking.additionalInfo,
    )

    // Create Customer
    if (rawBooking.customer) {
      const customer = new Person(
      rawBooking.customer.id,
      rawBooking.customer.givenName,
      rawBooking.customer.familyName
    )
    customer.setUserName(rawBooking.customer.username)
    customer.setPhoneNumber(rawBooking.customer.phoneNumber)
    customer.setAdditionalInfo(rawBooking.customer.additionalInfo)
    customer.setCustomer(rawBooking.customer.isCustomer)
    customer.setReceptionist(rawBooking.customer.isReceptionist)
    customer.setHealthcareWorker(rawBooking.customer.isHealthcareWorker)
    // Set customer in Booking
    booking.setCustomer(customer)
    }    
    
    // Create Test Site
    if (rawBooking.testingSite) {
      const testSite = new TestSiteCreator().createTestSite(rawBooking.testingSite)
      // Set test site in Booking
      booking.setTestingSite(testSite)
    }
    
    // Set other booking data
    booking.setNotes(rawBooking.notes)
    booking.setPIN(rawBooking.smsPin)
    booking.setBookingId(rawBooking.id)
    booking.setCovidTests(rawBooking.covidTests?.map((schema: CovidTestSchema) => TestFactory.instance.createTest(schema)))

    // Set notifications
    if (rawBooking.additionalInfo?.notifications) {
      booking.getNotificationsCollection().setNotifications(rawBooking.additionalInfo.notifications.map((rawNotification: any) => {
        const notification = new NotificationCreator().createNotification(rawNotification)
        // Set booking in the notification
        notification.setBooking(booking)
        return notification
      }
      ))
    }

    return booking
  }
}