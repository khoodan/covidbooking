import { RecordCollection } from "../test/RecordCollection";
import { Test } from "../test/Test";

/**
 * TestClient
 * Defines functionality for dealing with Tests
 */
export interface TestClient {
  /**
   * Gets Tests from the API
   */
  getTests(): Promise<RecordCollection>;
  /**
   * Post a new Test to the API
   */
  postTest(test: Test): Promise<void>;
}