import { ResultType } from "./ResultType";

/**
 * Result Class
 * Holds data about a result as well as functionality
 */
export class Result {
  /**
   * The result type
   */
  private resultType: ResultType;


  /**
   * Getter for result
   * @returns {ResultType} type
   */
  getResult() {
    return this.resultType
  }

  /**
   * Initialiser
   * @param result
   */
  constructor(result: ResultType) {
    this.resultType = result;
  }

  /**
   * Result setter
   * @param result 
   */
  setResult(result: ResultType) {
    this.resultType = result;
  }
}