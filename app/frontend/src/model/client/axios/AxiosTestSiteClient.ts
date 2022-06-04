import { TestSiteCreator } from "../../location/factory/TestSiteCreator";
import { TestSite } from "../../location/TestSite";
import { TestSiteCapability } from "../../location/TestSiteCapability";
import { TestSiteCollection } from "../../location/TestSiteCollection";
import { WalkDriveFacility } from "../../location/WalkDriveFacility";
import { NotificationCreator } from "../../notification/factory/NotificationCreator";
import { TestSiteClient } from "../TestSiteClient";
import { AxiosClient } from "./AxiosClient";

/**
 * AxiosTestSiteClient
 * Get the test sitess
 * Implementation of the TestSiteClient
 */
export class AxiosTestSiteClient extends AxiosClient implements TestSiteClient {
  /**
   * Sets the path for the client
   */
  constructor() {
    super('/testing-site')
  }

  /**
   * Get Test Sites from APi
   * @return {Promise<TestSite[]>} testsites
   */
  public async getTestSites(): Promise<TestSiteCollection> {
    const rawTestSiteSiteData = await this.client.get('/?fields=bookings.covidTests')
    const creator = new TestSiteCreator()
    const testSiteData: any[] = rawTestSiteSiteData.data
    const testSites: TestSite[] = testSiteData.map(rawTestSite => creator.createTestSite(rawTestSite))
    return new TestSiteCollection(testSites)
  }

  /**
   * Updates a test sites notifications
   * @param testSite test site to update notifications for
   */
  public async updateTestSiteNotifications(testSite: TestSite): Promise<void> {
    const testSiteData = {
      additionalInfo: {
        notifications: testSite.getNotificationsCollection().getNotifications().map(notification => new NotificationCreator().createRawNotification(notification)),
        hasRegisterCapability: testSite.hasCapability(TestSiteCapability.BOOKING),
        hasTestingCapabilityj: testSite.hasCapability(TestSiteCapability.TESTING),
        hasWalkFacility: testSite.hasFacility(WalkDriveFacility.WALK),
        hasDriveFacility: testSite.hasFacility(WalkDriveFacility.DRIVE),
      }
    }
    await this.client.patch(`/${testSite.getId()}`, testSiteData)
  }
}