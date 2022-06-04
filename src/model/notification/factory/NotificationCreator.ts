import { Notification } from "../Notification";

/**
 * Creator for Notifications
 */
export class NotificationCreator {
  /**
   * Creates a notification
   * @param rawNotification raw notification data from API
   */
  createNotification(rawNotification: any): Notification {
    const notification = new Notification(
      rawNotification.bookingId,
      new Date(rawNotification.date),
      rawNotification.type
    )
    notification.setTestSiteId(rawNotification.testSiteId)
    return notification
  }

  /**
   * Converts a Notification into an object for the API
   * @param notification 
   */
  createRawNotification(notification: Notification) {
    return {
      bookingId: notification.getBookingId(),
      date: notification.getDate().toISOString(),
      type: notification.getType(),
      testSiteId: notification.getTestSiteId()
    }
  }
}