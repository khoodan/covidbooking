import { UserCollection } from "../model/user/UserCollection";

/**
 * UserPresenter interface
 * Defines functionality for the User Presenter
 */
 export interface UserPresenter {
  /**
   * Getter for users
   */
  get users(): UserCollection | undefined
}

