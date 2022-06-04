import { ClientManager } from "../ClientManager";
import { TestClient } from "../TestClient";
import { UserClient } from "../UserClient";
import { AxiosTestClient } from "./AxiosTestClient";
import { TestSiteClient } from "../TestSiteClient";
import { AxiosTestSiteClient } from "./AxiosTestSiteClient";
import { AxiosUserClient } from "./AxiosUserClient";
import { AuthenticationClient } from "../AuthenticationClient";
import { AxiosAuthenticationClient } from "./AxiosAuthenticationClient";
import { GeocodingClient } from "../GeocodingClient";
import { AxiosGeocodingClient } from "./AxiosGeocodingClient";
import { AxiosBookingClient } from "./AxiosBookingClient";
import { BookingClient } from "../BookingClient";

/**
 * Implementation of the ClientManager
 * Uses the singleton creational design pattern to ensure only one manager exists at a time
 */
export class AxiosClientManager implements ClientManager {
  // Storage for singleton
  private static manager: AxiosClientManager;

  /**
   * Singleton Creational Design Pattern
   * Retrieves the AxiosClientManager instance if there is one
   * Otherwise creates a new one and returns that
   */
  public static get instance(): AxiosClientManager {
    if (AxiosClientManager.manager) return AxiosClientManager.manager;
    return new AxiosClientManager()
  }
  
  /**
   * Initialise the clients
   * @param test test client
   * @param testSite testSite client
   * @param user user client
   * @param authentication authentication client  
   * @param geocoding geocoding client
   * @param booking booking client
   */
  private constructor(
    public test: TestClient = new AxiosTestClient(),
    public testSite: TestSiteClient = new AxiosTestSiteClient(),
    public user: UserClient = new AxiosUserClient(),
    public authentication: AuthenticationClient = new AxiosAuthenticationClient(),
    public geocoding: GeocodingClient = new AxiosGeocodingClient(),
    public booking: BookingClient = new AxiosBookingClient()
  ) {}
}