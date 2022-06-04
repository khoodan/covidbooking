import { UserSchema } from "../../client/schema/UserSchema";
import { User } from "../User";
import { UserType } from "../UserType";
import { PersonCreator } from "./PersonCreator";
import { UserCreator } from "./UserCreator";


/**
 * Factory class for creating users
 */
export class UserFactory {
  /**
   * Singleton variable
   */
  private static factory: UserFactory

  /**
   * Singleton getter
   */
  static get instance(): UserFactory {
    if (!UserFactory.factory) UserFactory.factory = new UserFactory()
    return UserFactory.factory
  }

  /**
   * Creators for each User
   */
  private creators: {[key in UserType]: UserCreator};

  /**
   * Initialise creators
   */
  private constructor() {
    this.creators = {
      PERSON: new PersonCreator(),
      CUSTOMER: new PersonCreator(),
      HEALTHCAREWORKER: new PersonCreator(),
      RECEPTIONIST: new PersonCreator()
    }
  }

  /**
   * Create user
   * @param userData data used to create each instance
   * @returns a singular User
   */
  public createUser(userData: UserSchema): User {
    return this.creators.PERSON.createUser(userData);
  }
}