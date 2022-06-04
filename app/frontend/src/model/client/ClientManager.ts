import { AuthenticationClient } from "./AuthenticationClient";
import { GeocodingClient } from "./GeocodingClient";
import { TestClient } from "./TestClient";
import { TestSiteClient } from "./TestSiteClient";
import { UserClient } from "./UserClient";
import { BookingClient } from "./BookingClient"

/**
 * Interface for the ClientManager
 * Used by Collections and other classes within the DataModel to interact with the API
 */
export interface ClientManager {
  /**
   * TestClient
   */
  get test(): TestClient;
  /**
   * TestSiteClient
   */
  get testSite(): TestSiteClient;
  /**
   * UserClient
   */
  get user(): UserClient;
  /**
   * AuthenticationClient
   */
  get authentication(): AuthenticationClient;
  /**
   * GeocodingClient
   */
  get geocoding(): GeocodingClient;
  /**
   * BookingClient
   */
   get booking(): BookingClient;
}