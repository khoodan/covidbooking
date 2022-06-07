import { TestSiteSchema } from "@schema/LocationSchema";

export interface TestSiteClient {
  getTestSites(): Promise<TestSiteSchema[]>
  addTestSite(testsite: TestSiteSchema): Promise<void>
}