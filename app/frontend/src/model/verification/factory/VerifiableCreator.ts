import { Verifiable } from "../Verifiable";
import { VerifiableType } from "../VerifiableType";

/**
 * VerifiableCreator
 * Creates Verifiables
 */
export interface VerifiableCreator {
  /**
   * Creator method
   */
  createVerifiable(): Verifiable;
}