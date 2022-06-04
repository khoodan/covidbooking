import { ResultType } from "./result/ResultType";
import { Test } from "./Test";

/**
 * Collection of Records
 */
class RecordCollection {
    /**
     * Storage of tests
     */
    private tests: Test[]
    /**
     * Initialise tests and client
     */
    constructor(tests: Test[]) {
        this.tests = tests
    }

    /**
     * Finds the number of tests
     * @returns {number} total number of tests
     */
    getNumberOfTests(): number {
        return this.tests.length
    }

    /**
     * Calculates and returns the number of cases with the result of a specific type
     * @param {ResultType} resultType type of result that we want to count
     * @returns {number} number of tests with resultType
     */
    getNumberOfCases(resultType: ResultType): number {
        return this.tests.reduce((count: number, test: Test) => test.getResult() == resultType ? count + 1 : count, 0)
    }

    /**
     * Gets tests from API and returns them
     * @post stores tests in private attribute
     * @returns {Test[]} promise to return a list of tests
     */
    getTests(): Test[] {
        return this.tests
    }
}

export { RecordCollection };
