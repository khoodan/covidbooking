import { Notification } from './Notification'

/**
 * Collection of Notifications
 */
export class NotificationCollection {
  /**
   * Notification list storage
   */
  private notifications: Notification[]

  /**
   * Initialise notifications
   */
  constructor() {
    this.notifications = []
  }

  /**
   * Setter for notifications
   * @param notifications 
   */
  setNotifications(notifications: Notification[]) {
    this.notifications = notifications
  }

  /**
   * Getter for notifications
   */
  getNotifications(): Notification[] {
    return this.notifications
  }

  /**
   * Adds a notification to the list
   * @param notification 
   */
  addNotification(notification: Notification) {
    this.notifications.push(notification)
  }

  /**
   * Combines another collection into this one
   * @param collection to add
   */
  addCollection(collection: NotificationCollection) {
    this.notifications = this.notifications.concat(collection.getNotifications());
  }

  /**
   * Sorts the collection by date
   * @returns {Notification[]} sorted notifications by date
   */
  sortByDate(): Notification[] {
    return this.notifications.sort((n1, n2) => {
      return n1.getDate() > n2.getDate() ? -1 : 1
    })
  }
}