import { Verifiable } from "./Verifiable";
import { VerifiableType } from "./VerifiableType";

/**
 * PIN Code Verifiable
 */
export class PIN extends Verifiable {
  /**
   * The PIN Code
   */
  private PINCode: string;

  /**
   * Generates a PIN if it does not exist
   * @param pin if there is already a PIN, can set it
   */
  constructor(pin?: string) {
    super(VerifiableType.PIN)
    if (pin) {
      this.PINCode = (pin)
      return
    }
    this.PINCode = this.generatePIN()
  }

  /**
   * Generator for the PIN code
   * @post sets PINCode
   */
  private generatePIN(): string {
    // Generate random 5-digit number
    return String(Math.floor(10000 + Math.random() * 90000));
  }

  /**
   * Setter for the PIN
   * @param pin pin to set
   */
  setVerifiable(pin: string) {
    this.PINCode = pin;
  }

  /**
   * Returns the verifiable code as a string.
   * @return {string} the verifiable code
   */
  string(): string {
    return this.PINCode
  }

  /**
   * Verifies code is valid
   * @param code to verify
   */
  isValid(code: string): boolean {
    return code === this.PINCode
  }

}