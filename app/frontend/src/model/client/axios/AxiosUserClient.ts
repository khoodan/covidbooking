import { UserFactory } from "../../user/factory/UserFactory";
import { User } from "../../user/User";
import { UserCollection } from "../../user/UserCollection";
import { UserSchema } from "../schema/UserSchema";
import { UserClient } from "../UserClient";
import { AxiosClient } from "./AxiosClient";

/**
 * AxiosUserClient
 * Implementation of the UserClient to get user data from API
 */
export class AxiosUserClient extends AxiosClient implements UserClient {
  /**
   * Creates a client with the /user path
   */
  constructor() {
    super('/user')
  }

  /**
   * Gets users from API and converts them into respective Actor types using the Factory
   * @returns List of Actors
   */
  async getUsers(): Promise<UserCollection> {
    const rawTestData = await this.client.get('/?fields=bookings.covidTests&testsTaken&testsAdministered')
    const userData: UserSchema[] = rawTestData.data
    return new UserCollection(userData.map(rawUser => {
      // Create new Person for each user found
      return UserFactory.instance.createUser(rawUser)
    }))
  }
}