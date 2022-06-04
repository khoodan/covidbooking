import { Test } from "../Test";
import { CovidTestSchema } from "../../client/schema/CovidTestSchema";

/**
 * Creator interface for Tests
 */
export interface TestCreator {
  /**
   * Factory method to create the test
   * Information given is using the schema from the API
   */
  createTest(testData: CovidTestSchema): Test;
}