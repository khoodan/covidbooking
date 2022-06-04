import { BookingCollection } from "../model/booking/BookingCollection";
import { TestSiteCollection } from "../model/location/TestSiteCollection";
import { RecordCollection } from "../model/test/RecordCollection";
import { UserCollection } from "../model/user/UserCollection";
import { Updater } from "./Updater";

/**
 * DataLayer
 * Defines the data that is stored in this layer
 */
 export interface DataLayer extends UserDataLayer, BookingDataLayer, TestSiteDataLayer, RecordDataLayer {}

/**
 * UserDataLayer
 * Defines the data getter and setter for Users
 */
 export interface UserDataLayer extends BaseDataLayer {
  /**
   * Users getters
   */
  get users(): UserCollection | undefined;
  /**
   * Users setters
   */
  setUsers(users: UserCollection): void;
  /**
   * Users Updater
   */
  get usersUpdater(): Updater;
}

/**
 * BookingDataLayer
 * Defines the data getter and setter for Bookings
 */
 export interface BookingDataLayer extends BaseDataLayer {
  /**
   * Bookings getters
   */
  get bookings(): BookingCollection | undefined;
  /**
   * Bookings setters
   */
  setBookings(bookings: BookingCollection): void;
  /**
   * Bookings Updater
   */
  get bookingsUpdater(): Updater;
}

/**
 * TestSiteDataLayer
 * Defines the data getter and setter for TestSites
 */
 export interface TestSiteDataLayer extends BaseDataLayer {
  /**
   * TestSites getters
   */
  get testSites(): TestSiteCollection | undefined;
  /**
   * TestSites setters
   */
  setTestSites(testsites: TestSiteCollection): void;
  /**
   * TestSites Updater
   */
  get testSitesUpdater(): Updater;
}

/**
 * RecordDataLayer
 * Defines the data getter and setter for Records
 */
 export interface RecordDataLayer extends BaseDataLayer {
  /**
   * Records getters
   */
  get records(): RecordCollection | undefined;
  /**
   * Records setters
   */
  setRecords(records: RecordCollection): void;
  /**
   * Records Updater
   */
  get recordsUpdater(): Updater;
}

export interface BaseDataLayer {
  /**
   * Updates everything
   */
  updateAllData(): void
}