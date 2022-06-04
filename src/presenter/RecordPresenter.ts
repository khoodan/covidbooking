import { CovidTestSchema } from "../model/client/schema/CovidTestSchema";
import { RecordCollection } from "../model/test/RecordCollection";

/**
 * Interface which defines the Presenter for Records
 */
export interface RecordPresenter {
  /**
   * Getter for records
   */
  get records(): RecordCollection | undefined
  /**
   * Creates and returns a new test
   * @param {CovidTestSchema} testData required to make the test
   * @post creates new test
   */
  createTest(testData: CovidTestSchema): Promise<void>
}