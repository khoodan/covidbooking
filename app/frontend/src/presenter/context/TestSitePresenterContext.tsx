import React, { useContext } from "react";
import { AxiosClientManager } from "../../model/client/axios/AxiosClientManager";
import { TestSite } from "../../model/location/TestSite";
import { TestSiteDataLayer } from "../DataLayer";
import { TestSitePresenter } from "../TestSitePresenter";
import { DataLayerContext } from "./DataLayerContext";

/**
 * Context for TestSitePresenter
 */
const TestSitePresenterContext = React.createContext<TestSitePresenter>({} as TestSitePresenter)

/**
 * Provider for the TestSitePresenter
 * Allows the application to access the methods and data of the TestSitePresenter
 */
class TestSitePresenterProviderWithoutData extends React.Component<TestSiteDataLayer> {
  /**
  * Constructor for the Provider
  * Initialises the Provider
  */
  constructor(props: React.PropsWithChildren<TestSiteDataLayer>) {
    super(props)

    this.getTestSites = this.getTestSites.bind(this);
    this.updateTestSiteNotifications = this.updateTestSiteNotifications.bind(this);
  }

  /**
   * Runs when we need to update data
   */
  componentDidUpdate(prevProps: TestSiteDataLayer) {
    if (prevProps.testSitesUpdater != this.props.testSitesUpdater) {
      this.getTestSites()
    }
  }

  /**
   * Gets required information when loaded
   */
  componentDidMount() {
    this.getTestSites()
  }

  /**
   * Gets testSites from API through API client
   * Sets the testSites in the DataLayer
   */
  getTestSites(): Promise<void> {
    return AxiosClientManager.instance.testSite.getTestSites()
      .then(testSites => this.props.setTestSites(testSites))
  }

  /**
   * Updates notifications for a test site
   * @param testSite to update notifications for
   */
  async updateTestSiteNotifications(testSite: TestSite): Promise<void> {
    await AxiosClientManager.instance.testSite.updateTestSiteNotifications(testSite)
    this.props.updateAllData()
  }

  /**
   * Provides the TestSitePresenter
   */
  render() {
    return (
      <TestSitePresenterContext.Provider value={{
        testSites: this.props.testSites,
        updateTestSiteNotifications: this.updateTestSiteNotifications
      }}>
        {this.props.children}
      </TestSitePresenterContext.Provider>
    )
  }
}

/**
 * TestSitePresenterProvider
 * High order component which provides the TestSitePresenter with access to the DataLayer
 */
export const TestSitePresenterProvider: React.FC = ({ children }) => {
  return (
    <DataLayerContext.Consumer>
      {(layer) =>
        <TestSitePresenterProviderWithoutData {...layer}>
          {children}
        </TestSitePresenterProviderWithoutData>
      }
    </DataLayerContext.Consumer>
  )
}

/**
 * Hook for allowing the View to use the TestSitePresenter
 */
export const useTestSitePresenter = () => useContext<TestSitePresenter>(TestSitePresenterContext)