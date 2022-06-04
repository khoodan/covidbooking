import { User } from "../User";
import { UserSchema } from "../../client/schema/UserSchema";

/**
 * Creator interface for Users
 */
export interface UserCreator {
  /**
   * Factory method to create the user
   * Information given is using the schema from the API
   */
  createUser: (userData: UserSchema) => User;
}