import { VerifiableType } from "./VerifiableType";
import { Person } from "../user/Person"

/**
 * Verifiable
 */
export abstract class Verifiable {
  /**
   * Keeps track of this Verifiable's type
   */
  protected verifiableType: VerifiableType;

  /**
   * Initialises the verifiable
   * @param verifiableType type of the verifiable
   */
  constructor(verifiableType: VerifiableType) {
    this.verifiableType = verifiableType
  }

  /**
   * Returns a string representation of this verifiable
   */
  abstract string(): string

  /**
   * Sets the verifiable
   * @param ver verifiable to set
   */
  abstract setVerifiable(ver: string): void

  /**
   * Verifies that the code given is correct
   */
  abstract isValid(code: string): boolean

  /**
   * Gets the verifiable type
   * @returns {VerifiableType} of this verifiable
   */
  type(): VerifiableType {
    return this.verifiableType
  }

  /**
   * Returns a display string representation of the verifiable
   */
  display(): string {
    return `${this.verifiableType}: ${this.string()}`
  }
}