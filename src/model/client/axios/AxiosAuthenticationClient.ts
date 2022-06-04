import { AxiosResponse } from "axios";
import { AuthenticationClient } from "../AuthenticationClient";
import { CreateUserSchema, Credentials, JWT } from "../schema/UserSchema";
import { AxiosClient } from "./AxiosClient";

/**
 * AuthenticationClient Implementation
 */
export class AxiosAuthenticationClient extends AxiosClient implements AuthenticationClient {
  /**
   * Sets up the client to be authentication
   */
  constructor() {
    super('/user')
  }

  /**
   * Login to system
   * @param credentials package of username and password for logging in
   * @throws {UNAUTHORIZED} error if invalid credentials
   */
  async login(credentials: Credentials): Promise<JWT> {
    return this.client.post('/login?jwt=true', credentials)
    .then((response: AxiosResponse<JWT>) => response.data) // We need to set this JWT somewhere for calls
  }

  /**
   * Registers a user
   * @param user user to create
   * @post creates user in API
   */
  async register(user: CreateUserSchema): Promise<void> {
    return this.client.post('/', user)
  }

}