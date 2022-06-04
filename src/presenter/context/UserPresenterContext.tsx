import React, { useContext } from "react";
import { AxiosClientManager } from "../../model/client/axios/AxiosClientManager";
import { UserDataLayer } from "../DataLayer";
import { DataLayerContext } from "./DataLayerContext";
import { UserPresenter } from "../UserPresenter";

/**
 * Context for the UserPresenter so that the View can be updated by the Presenter
 */
const UserPresenterContext = React.createContext<UserPresenter>({} as UserPresenter)

/**
 * Provider for the UserPresenter which holds implementation for the UserPresenter
 */
class UserPresenterProviderWithoutData extends React.Component<UserDataLayer> {
  /**
   * Initialises the Provider
   */
  constructor(props: React.PropsWithChildren<undefined>) {
    super(props)

    this.getUsers = this.getUsers.bind(this)
  }

  /**
   * Runs when we need to update
   */
  componentDidUpdate(prevProps: UserDataLayer) {
    if (prevProps.usersUpdater != this.props.usersUpdater) {
      this.getUsers()
    }
  }

  /**
   * Gets required information when loaded
   */
  componentDidMount() {
    this.getUsers()
  }

  /**
   * Gets users from the API
   */
  getUsers(): Promise<void> {
    return AxiosClientManager.instance.user.getUsers()
      .then(users => this.props.setUsers(users))
  }

  /**
   * Provides the user data and methods to the application
   */
  render() {
    return (
      <UserPresenterContext.Provider value={{ users: this.props.users }}>
        {this.props.children}
      </UserPresenterContext.Provider>
    )
  }
}

/**
 * UserPresenterProvider
 * High order component which provides the UserPresenter with access to the DataLayer
 */
export const UserPresenterProvider: React.FC = ({ children }) => {
  return <DataLayerContext.Consumer>
    {(layer) => <UserPresenterProviderWithoutData {...layer}>
      {children}
    </UserPresenterProviderWithoutData>}
  </DataLayerContext.Consumer>
}

/**
 * Hook for allowing the View to use the UserPresenter
 */
export const useUserPresenter = () => useContext<UserPresenter>(UserPresenterContext)