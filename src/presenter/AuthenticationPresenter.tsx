import { CreateUserSchema } from "../model/client/schema/UserSchema";
import { User } from "../model/user/User";

/**
 * Authentication interface
 *
 * @param {User} user that is stored
 * @param {function} setUser sets the user in the context
 */

export interface AuthenticationPresenter {
  /**
   * Current logged in user
   */
  currentUser?: User;
  /**
   * Functionality for logging in
   * @param username username
   * @param password password
   */
  login?: (username: string, password: string) => Promise<void>
  /**
   * Logout
   * Used to clear data
   */
  logout?: () => void;
  /**
   * Register functionality
   * @param userInfo the information required to create a user
   */
  register?: (userInfo: CreateUserSchema) => Promise<void>
}
