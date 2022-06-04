import React, { useContext } from "react";
import { AxiosClientManager } from "../../model/client/axios/AxiosClientManager";
import { CovidTestSchema } from "../../model/client/schema/CovidTestSchema";
import { TestFactory } from "../../model/test/factory/TestFactory";
import { RecordDataLayer } from "../DataLayer";
import { RecordPresenter } from "../RecordPresenter";
import { DataLayerContext } from "./DataLayerContext";

/**
 * Context for RecordPresenter
 */
const RecordPresenterContext = React.createContext<RecordPresenter>({} as RecordPresenter)

/**
 * Provider for the RecordPresenter
 * Allows the application to access the methods and data of the RecordPresenter
 */
class RecordPresenterProviderWithoutData extends React.Component<RecordDataLayer> {
  /**
  * Constructor for the Provider
  * Initialises the Provider
  */
  constructor(props: React.PropsWithChildren<RecordDataLayer>) {
    super(props)

    this.getRecords = this.getRecords.bind(this);
    this.createTest = this.createTest.bind(this);
  }

  /**
   * Runs when we need to update data
   */
  componentDidUpdate(prevProps: RecordDataLayer) {
    if (prevProps.recordsUpdater != this.props.recordsUpdater) {
      this.getRecords()
    }
  }

  /**
   * Gets required information when loaded
   */
  componentDidMount() {
    this.getRecords()
  }

  /**
   * Gets records from API through API client
   * Sets the records in the DataLayer
   */
  getRecords(): Promise<void> {
    return AxiosClientManager.instance.test.getTests()
      .then(records => this.props.setRecords(records))
  }

  /**
   * Creates and returns a new test
   * @param {CovidTestSchema} testData required to make the test
   * @post creates new test
   */
  async createTest(testData: CovidTestSchema): Promise<void> {
    const test = TestFactory.instance.createTest(testData)
    await AxiosClientManager.instance.test.postTest(test)
    this.props.updateAllData()
  }

  /**
   * Provides the RecordPresenter
   */
  render() {
    return (
      <RecordPresenterContext.Provider value={{
        records: this.props.records,
        createTest: this.createTest
      }}>
        {this.props.children}
      </RecordPresenterContext.Provider>
    )
  }
}

/**
 * RecordPresenterProvider
 * High order component which provides the RecordPresenter with access to the DataLayer
 */
export const RecordPresenterProvider: React.FC = ({ children }) => {
  return (
    <DataLayerContext.Consumer>
      {(layer) =>
        <RecordPresenterProviderWithoutData {...layer}>
          {children}
        </RecordPresenterProviderWithoutData>
      }
    </DataLayerContext.Consumer>
  )
}

/**
 * Hook for allowing the View to use the RecordPresenter
 */
export const useRecordPresenter = () => useContext<RecordPresenter>(RecordPresenterContext)