import { APIStatus } from "../client/APIStatus";
import { AxiosClientManager } from "../client/axios/AxiosClientManager";
import { UserClient } from "../client/UserClient";
import { User } from "./User";
import { UserType } from "./UserType";

/**
 * UserCollection
 * Stores User instances and provides methods for filtering through them
 */
export class UserCollection {
  // Store users
  private users: User[]

  /**
   * Sets users initially
   * @param users to set
   */
  constructor(users: User[]) {
    this.users = users;
  }

  /**
   * Sets the users for this collection
   * @param users to set
   */
  setUsers(users: User[]): void {
    this.users = users
  }

  /**
   * Getting user by username
   * @param username of the Person we are searching for
   * @returns {Promise<User>} the person we are searching for
   */
  getUserByUserName(username: string): User {
    // Filter by username
    for (const user of this.users) {
      if (user.getUsername() === username) {
        return user;
      }
    }
    // Not found so throw error
    throw new Error(APIStatus.NOTFOUND)
  }

  /**
   * Returns all users by a specific type
   * @param types types (all in set must be met by the user to be returned)
   */
  getAllByType(types: Set<UserType>): User[] {
    // Check and return types
    return this.users.filter(user => {
      for (const type of Array.from(types)) {
        if (!user.hasType(type)) return false // Does not have this type so return false
      }
      return true // Has all
    })
  }

  /**
   * Getting user by id
   * @param id of the Person we are searching for
   * @returns {Promise<User>} the person we are searching for
   */
  getUserByID(id: string): User {
    // Filter by username
    for (const user of this.users) {
      if (user.getId() === id) {
        return user;
      }
    }
    // Not found so throw error
    throw new Error(APIStatus.NOTFOUND)
  }
}