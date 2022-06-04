import { TestSite } from "../model/location/TestSite";
import { TestSiteCollection } from "../model/location/TestSiteCollection";

/**
 * Interface which defines the Presenter for TestSites
 */
export interface TestSitePresenter {
  /**
   * Getter for testsites
   */
  get testSites(): TestSiteCollection | undefined
  /**
   * Updates notifications for a test site
   * @param testSite to update notifications for
   */
  updateTestSiteNotifications(testSite: TestSite): Promise<void>
}