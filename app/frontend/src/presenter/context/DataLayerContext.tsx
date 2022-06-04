import React from "react";
import { BookingCollection } from "../../model/booking/BookingCollection";
import { TestSiteCollection } from "../../model/location/TestSiteCollection";
import { RecordCollection } from "../../model/test/RecordCollection";
import { UserCollection } from "../../model/user/UserCollection";
import { DataLayer } from "../DataLayer";
import { Updater } from "../Updater";

/**
 * Context for the DataLayer
 */
export const DataLayerContext = React.createContext<DataLayer>({} as DataLayer);

/**
 * Provider for the DataLayer
 * Allows other components to access the DataLayer and its data
 */
export class DataLayerProvider extends React.Component<unknown, {
  /**
   * State
   * Persists data throughout component updates
   */
  users: UserCollection | undefined;
  usersUpdater: Updater,
  bookings: BookingCollection | undefined;
  bookingsUpdater: Updater
  testSites: TestSiteCollection | undefined;
  testSitesUpdater: Updater
  records: RecordCollection | undefined;
  recordsUpdater: Updater
}> {
  /**
   * Set initial state
   */
  constructor(props: unknown) {
    super(props)

    /**
     * Set initial state
     */
    this.state = {
      users: undefined,
      usersUpdater: new Updater(),
      bookings: undefined,
      bookingsUpdater: new Updater(),
      testSites: undefined,
      testSitesUpdater: new Updater(),
      records: undefined,
      recordsUpdater: new Updater(),
    }

    /**
     * Binds methods
     */
    this.setUsers = this.setUsers.bind(this);
    this.setBookings = this.setBookings.bind(this);
    this.setTestSites = this.setTestSites.bind(this);
    this.setRecords = this.setRecords.bind(this);
    this.updateAll = this.updateAll.bind(this);
  }

  /**
   * Sets the users in the state
   * @param users users to update
   */
  setUsers(users: UserCollection): void {
    this.setState(s => ({...s, users}))
  };

  /**
   * Sets the bookings in the state
   * @param bookings to update
   */
  setBookings(bookings: BookingCollection): void {
    this.setState(s => ({...s, bookings}))
  };

  /**
   * Sets the test sites in the state
   * @param testSites to update
   */
  setTestSites(testSites: TestSiteCollection): void {
    this.setState(s => ({...s, testSites}))
  };

  /**
   * Sets the records into the state
   * @param records to update
   */
  setRecords(records: RecordCollection): void {
    this.setState(s => ({...s, records}))
  };

  /**
   * Updates All Data
   */
  updateAll(): void {
    this.setState(prev => ({
      ...prev,
      testSitesUpdater: this.state.testSitesUpdater.update(),
      usersUpdater: this.state.usersUpdater.update(),
      recordsUpdater: this.state.recordsUpdater.update(),
      bookingsUpdater: this.state.bookingsUpdater.update(),
    }))
  }

  /**
   * Provide the data to the application
   */
  render() {
    return (
      <DataLayerContext.Provider value={{
        ...this.state,
        setUsers: this.setUsers,
        setBookings: this.setBookings,
        setTestSites: this.setTestSites,
        setRecords: this.setRecords,
        updateAllData: this.updateAll
      }}>
        {this.props.children}
      </DataLayerContext.Provider>
    )
  }
}