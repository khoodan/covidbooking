/**
 * Updater
 * Holds value to know when to update
 * Holds method to force a data update
 */
export class Updater {
  // Value of update
  private updateValue: number;

  /**
   * Getter to retrieve the value of whether we are to update
   */
  get toUpdate(): number {
    return this.updateValue;
  }

  /**
   * Updates the number, forcing an update of the data
   */
  update(): Updater {
    const updater = new Updater()
    updater.updateValue++;
    return updater;
  }

  /**
   * Initialise update value
   */
  constructor() {
    this.updateValue = 1;
  }
}