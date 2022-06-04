import { QR } from "../QR";
import { Verifiable } from "../Verifiable";
import { VerifiableCreator } from "./VerifiableCreator";

/**
 * QRCreator
 * Creates QR Codes
 */
export class QRCreator implements VerifiableCreator {
  /**
   * Creates QR
   * @returns {QR} new QR code class
   */
  createVerifiable(): Verifiable {
    return new QR();
  }
}