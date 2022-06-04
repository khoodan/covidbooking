import { GeocodingClient } from "../GeocodingClient";
/**
 * Geocoding Client Implementation
 * Gets geolocation using the Geocoder
 */
export class AxiosGeocodingClient implements GeocodingClient {
  /**
   * Gets the geolocation details for a given address
   * @param address string address to get geolocation data of
   * @return {GeocodeResult[]} geolocation data in a list
   */
  async getGeolocation(address: string): Promise<google.maps.GeocoderResult[]> {
    // Convert spaces to +
    address = address.replace(' ', '+')

    // Make call
    const geocoder = new google.maps.Geocoder()
    return (await geocoder.geocode({ address })).results
  }
}