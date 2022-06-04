import { Verifiable } from "../Verifiable";
import { VerifiableType } from "../VerifiableType";
import { PINCreator } from "./PINCreator";
import { QRCreator } from "./QRCreator";
import { VerifiableCreator } from "./VerifiableCreator";

/**
 * VerifiableFactory
 * Used to create Verifiables
 */
export class VerifiableFactory {
  private static factory: VerifiableFactory | undefined

  /**
   * Stores the types of creators
   */
  private creators: {[key in VerifiableType]: VerifiableCreator};

  /**
   * Sets out the creators
   */
  private constructor() {
    this.creators = {
      PIN: new PINCreator(),
      QR: new QRCreator()
    }
  }

  /**
   * Singleton getter
   */
  static get instance(): VerifiableFactory {
    // Return existing if exists
    if (VerifiableFactory.factory) return VerifiableFactory.factory
    // Create if doesn't exist
    else {
      VerifiableFactory.factory = new VerifiableFactory()
      return VerifiableFactory.factory
    }
  }

  /**
   * Creates the verifiable based on the type given
   * @param type of verifiable to create
   * @returns {Verifiable} new verifiable
   */
  public createVerifiable(type: VerifiableType): Verifiable {
    return this.creators[type].createVerifiable();
  }
}