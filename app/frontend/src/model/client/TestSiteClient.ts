import { TestSite } from "../location/TestSite";
import { TestSiteCollection } from "../location/TestSiteCollection";

/**
 * TestSiteClient
 * Provides functionality for getting test site data from API
 */
export interface TestSiteClient {
  /**
   * Get Test Sites from APi
   * @return {Promise<TestSiteCollection>} testsites
   */
  getTestSites(): Promise<TestSiteCollection>;
  /**
   * Updates a test sites notifications
   * @param testSite test site to update notifications for
   */
  updateTestSiteNotifications(testSite: TestSite): Promise<void> 
}