import jwtDecode from "jwt-decode";
import React, { Context, useContext, useEffect, useMemo, useState } from "react";
import { AxiosClientManager } from "../../model/client/axios/AxiosClientManager";
import { User } from "../../model/user/User";
import { AuthenticationPresenter } from "../AuthenticationPresenter";
import { useUserPresenter } from "./UserPresenterContext";
import { CreateUserSchema } from "../../model/client/schema/UserSchema";
import { APIStatus } from "../../model/client/APIStatus";

/**
 * Creates the authentication context
 */
const AuthenticationPresenterContext: Context<AuthenticationPresenter> = React.createContext<AuthenticationPresenter>({})

/**
 * Provider for the authentication context
 * The User 
 * @param children Child React components
 * @returns {JSX.Element} Provider of User
 */
export const AuthenticationPresenterProvider: React.FC = ({ children }) => {
  const [currentUser, setUser] = useState<User>()
  const [jwt, setJwt] = useState<string>()

  const { users } = useUserPresenter()
  const authentication = AxiosClientManager.instance.authentication

  /**
   * Logout
   * Used to clear user data
   */
  const logout = (): void => {
    setJwt(undefined)
    setUser(undefined)
    localStorage.removeItem('jwt')
  }

  /**
   * Functionality for logging in
   * @param username username
   * @param password password
   */
  const login = async (userName: string, password: string) => {
    const jwtPackage = await authentication?.login({ userName, password })
    setJwt(jwtPackage.jwt)
  }

  /**
   * Sends a registration request to the API
   * @param {CreateUserSchema} userInfo the information required to create a user
   */
  const register = async (userInfo: CreateUserSchema) => {
    // Perform checks
    if (
      !userInfo.givenName ||
      !userInfo.familyName ||
      !userInfo.phoneNumber ||
      !userInfo.userName ||
      !userInfo.password ||
      // Need at least one permission
      !(userInfo.isCustomer || userInfo.isReceptionist || userInfo.isHealthcareWorker)
    ) throw new Error(APIStatus.BADREQUEST)

    // Send request
    await authentication.register(userInfo)
  }

  // Set up this context
  const authenticationContext: AuthenticationPresenter = useMemo(() => ({ currentUser, setJwt, login, logout, register }), [currentUser])


  /**
   * On login, change the current user
   */
  useEffect(() => {
    // Fetch user if we have a jwt
    if (!currentUser) {
      if (jwt) {
        // Decode to get username
        const decoded = jwtDecode(jwt) as any
        const username = decoded.username

        // Fetch user
        setUser(users?.getUserByUserName(username))

        // Set local storage
        localStorage.setItem('jwt', jwt)
      }
      else {
        // Check if we have a jwt in storage
        const storageJwt = localStorage.getItem('jwt')
        // If so, then set it; otherwise set undefined
        if (storageJwt) {
          setJwt(storageJwt)
        } else {
          setUser(undefined)
        }
      }
    }
  }, [users, jwt, currentUser])

  /**
   * Set the context
   */
  return (
    <AuthenticationPresenterContext.Provider value={authenticationContext}>
      {children}
    </AuthenticationPresenterContext.Provider>
  )
}

export const useAuthenticationPresenter = (): AuthenticationPresenter => useContext<AuthenticationPresenter>(AuthenticationPresenterContext)