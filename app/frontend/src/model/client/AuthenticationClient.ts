import { CreateUserSchema, Credentials, JWT } from "./schema/UserSchema";

/**
 * AuthenticationClient
 * Deals with authentication of the user
 */
export interface AuthenticationClient {
  /**
   * Logs the user into the system
   * @param credentials username and password
   */
  login(credentials: Credentials): Promise<JWT>;
  /**
   * Register a user
   * @param user details of a new user
   */
  register(user: CreateUserSchema): Promise<void>;
}