import { BookingCreator } from "../../booking/factory/BookingCreator";
import { NotificationCreator } from "../../notification/factory/NotificationCreator";
import { Address } from "../Address";
import { TestSite } from "../TestSite";

/**
 * TestSiteCreator
 * Creates a TestSite given raw data from the API
 */
export class TestSiteCreator {
  /**
   * Creates the TestSite
   * @param rawTestSite data from API
   */
  createTestSite(rawTestSite: any): TestSite {
    // Create Address for the retrieved test site
    const address: Address = new Address()
    address.setLatitude(rawTestSite.address.latitude)
    address.setLongitude(rawTestSite.address.longitude)
    address.setUnitNumber(rawTestSite.address.unitNumber)
    address.setStreet(rawTestSite.address.street)
    address.setStreet2(rawTestSite.address.street2)
    address.setSuburb(rawTestSite.address.suburb)
    address.setState(rawTestSite.address.state)
    address.setPostcode(rawTestSite.address.postcode)

    // Create new TestSite
    const testSite = new TestSite(
      rawTestSite.name,
      rawTestSite.additionalInfo,
      rawTestSite.id
    )
    testSite.setPhoneNumber(rawTestSite.phoneNumber)
    testSite.setAddress(address)
    const bookingCreator = new BookingCreator()
    testSite.setBookings(rawTestSite.bookings?.map((rawBooking: any) => bookingCreator.createBooking(rawBooking)))

    // Set notifications
    if (rawTestSite.additionalInfo.notifications) {
      const creator = new NotificationCreator()
      testSite.getNotificationsCollection().setNotifications(rawTestSite.additionalInfo.notifications.map((rawNotification: any) => {
        const notification = creator.createNotification(rawNotification)
        // Set booking in the notification
        notification.setTestsite(testSite)
        return notification
      }
      ))
    }

    return testSite
  }
}