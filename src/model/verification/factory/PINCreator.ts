import { PIN } from "../PIN";
import { Verifiable } from "../Verifiable";
import { VerifiableCreator } from "./VerifiableCreator";

/**
 * PINCreator
 * Creates PIN Codes
 */
export class PINCreator implements VerifiableCreator {
  /**
   * Creates PIN
   * @returns {PIN} new PIN code class
   */
  createVerifiable(): Verifiable {
    return new PIN();
  }
}