import { UserType } from "./UserType";

/**
 * General User Interface
 * Defines the methods that all Users should have
 */
export interface User {
  /**
   * Checks whether this user has a specific type
   * @param type to check
   * @returns {boolean} true if has
   */
  hasType(type: UserType): boolean

  /**
   * Gets username
   * @returns {string} username
   */
  getUsername(): string

  /**
   * Gets user id
   * @returns {string} user id
   */
   getId(): string

  /**
   * Gets display string of user
   * @returns {string} display string for user
   */
  display(): string
}