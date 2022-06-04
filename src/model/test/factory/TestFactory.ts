import { CovidTestSchema } from "../../client/schema/CovidTestSchema";
import { Test } from "../Test";
import { TestType } from "../TestType";
import { PCRTestCreator } from "./PCRTestCreator";
import { RATTestCreator } from "./RATTestCreator";
import { TestCreator } from "./TestCreator";

/**
 * Factory class for creating tests
 */
export class TestFactory {
  /**
   * Singleton variable
   */
  private static factory: TestFactory

  /**
   * Singleton getter
   */
  static get instance(): TestFactory {
    if (!TestFactory.factory) TestFactory.factory = new TestFactory()
    return TestFactory.factory
  }

  /**
   * Creators for each Test
   */
  private creators: {[key in TestType]: TestCreator};

  /**
   * Initialise creators
   */
  private constructor() {
    this.creators = {
      PCR: new PCRTestCreator(),
      RAT: new RATTestCreator()
    }
  }

  /**
   * Create test
   * @param testData data used to create each instance
   * @returns a singular Test
   */
  public createTest(testData: CovidTestSchema): Test {
    return this.creators[testData.type].createTest(testData);
  }
}