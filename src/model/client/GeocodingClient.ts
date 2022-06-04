/**
 * Interface for the Geocoding Client
 * Geocoding API gives us information about a location
 */
export interface GeocodingClient {
  /**
   * Gets the geolocation details for a given address
   * @param address string address to get geolocation data of
   * @return {GeocodeResult[]} geolocation data in a list
   */
  getGeolocation(address: string): Promise<google.maps.GeocoderResult[]>
}