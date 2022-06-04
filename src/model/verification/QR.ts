import { Verifiable } from "./Verifiable";
import { VerifiableType } from "./VerifiableType";
import { toDataURL } from 'qrcode'

/**
 * QR Code Verifiable
 */
export class QR extends Verifiable {
  /**
   * The QR Code in string format
   */
  private QRCode: string;

  /**
   * Initialises a QR
   */
  constructor() {
    super(VerifiableType.QR)

    this.QRCode = "" 
    this.setQRURL('none')
  }

  /**
   * Set the URL for the QR
   * @param url 
   */
  setQRURL(url: string) {
    // Generate QR code
    toDataURL(url) 
      .then(url => {
        this.QRCode = url
      })
      .catch(err => {
        console.error(err)
      })
  }

  /**
   * Returns the verifiable code as a string.
   * @return {string} the verifiable string
   */
   string(): string {
     return this.QRCode
  }

  /**
   * Sets the verifiable
   * @param qr verifiable to set
   */
  setVerifiable(qr: string): void {
      this.QRCode = qr
  }

  /**
   * Verifies code is valid
   * @param code to verify
   */
  isValid(code: string): boolean {
    return code === this.QRCode
  }

}