import { UserCollection } from "../user/UserCollection";

/**
 * UserClient Interface
 */
export interface UserClient {
  /**
   * Gets Users from database in a User form
   */
  getUsers(): Promise<UserCollection>
}