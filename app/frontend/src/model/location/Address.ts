import { APIStatus } from "../client/APIStatus"
import { AxiosClientManager } from "../client/axios/AxiosClientManager"

/**
 * Address class
 * Stores information about a particular address
 */
class Address {
  protected latitude: number | undefined
  protected longitude: number | undefined
  protected suburb?: string
  protected unitNumber?: string
  protected street?: string
  protected street2?: string | null
  protected state?: string
  protected postcode?: number
  /**
   * Returns a string representation of this address
   */
  get display(): string {
    const str = `${this.unitNumber ? this.unitNumber + ' ' : '' }${this.displayConverter(this.street)}${this.displayConverter(this.suburb)}${this.displayConverter(this.postcode?.toString())}${this.displayConverter(this.state)}`

    return str[str.length - 2] == ',' ? str.substring(0, str.length - 2) : str
  }

  /**
   * Gets latitude
   */
  get lat(): number {
    return this.latitude as number
  }

  /**
   * Gets longitude
   */
  get lon(): number {
    return this.longitude as number
  }

  /**
   * Converts an address part into a display readable part
   * @param str part of the address to convert
   */
  private displayConverter(str: string | undefined): string {
    return !!str ? str + ', ' : ''
  }

  /**
   * Gets suburb
   * @returns suburb
   */
  getSuburb(): string {
    return this.suburb as string
  }

  /**
   * Sets latitude
   * @param latitude 
   */
  setLatitude(latitude: number) {
    this.latitude = latitude;
  }

  /**
   * Sets longitude
   * @param longitude 
   */
  setLongitude(longitude: number) {
    this.longitude = longitude
  }

  /**
   * Sets suburb
   * @param suburb
   */
  setSuburb(suburb: string) {
    this.suburb = suburb
  }

  /**
   * Sets unit number
   * @param unit 
   */
  setUnitNumber(unit: string) {
    this.unitNumber = unit;
  }

  /**
   * Sets street
   * @param street 
   */
  setStreet(street: string) {
    this.street = street;
  }

  /**
   * Sets street2
   * @param street 
   */
  setStreet2(street: string) {
    this.street2 = street;
  }

  /**
   * Sets state
   * @param state 
   */
  setState(state: string) {
    this.state = state;
  }

  /**
   * Sets postcode
   * @param code 
   */
  setPostcode(code: number) {
    this.postcode = code;
  }

  /**
   * Uses Geocoding to get the latitude and longitude
   * @post sets the latitiude and longitude
   */
  async setLatLng(): Promise<void> {
    const results = await AxiosClientManager.instance.geocoding.getGeolocation(this.display)
    const location = results[0].geometry.location

    this.latitude = location.lat()
    this.longitude = location.lng()
  }

  /**
   * Getter for latlong
   */
  getLatLng(): { lat: number, lng: number } {
    if (!this.latitude || !this.longitude) throw new Error(APIStatus.NOTFOUND)
    return {
      lat: this.latitude,
      lng: this.longitude
    }
  }
}

export { Address }