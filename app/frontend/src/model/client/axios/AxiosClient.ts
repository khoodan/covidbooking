import axios, { AxiosError, AxiosInstance } from 'axios';
import { API } from '../../../constant/API';
import { APIStatus } from '../APIStatus';
import { Client } from '../Client';

/**
 * Abstract AxiosClient
 * Creates a client for use to access other API
 */
export abstract class AxiosClient implements Client {
  // The actual axiosClient
  private axiosClient: AxiosInstance;

  /**
   * Create the instance of the axiosClient
   * @param path after the base URL
   * @param baseURL the base URL of requests
   */
  constructor(path: string, baseURL: string = 'https://fit3077.com/api/v2') {
    this.axiosClient = axios.create({
      baseURL: baseURL + path,
      headers: {
        Authorization: API.key
      }
    })

    this.setupErrorInterceptors()
  }

  /**
   * Sets up the generic error interceptors
   */
  private setupErrorInterceptors(): void {
    // Setup response interceptor
    this.axiosClient.interceptors.response.use(
      // Success go ahead
      response => response,
      // Failure do error handling
      err => {
        console.log(err)
        const aerr = err as AxiosError
        if (aerr.response?.status == 403) throw new Error(APIStatus.UNAUTHORIZED)
        if (aerr.response?.status == 400) throw new Error(APIStatus.BADREQUEST)
        if (aerr.response?.status == 404) throw new Error(APIStatus.NOTFOUND)
        throw new Error(APIStatus.ERROR)
      }
    )
  }

  /**
   * Gets the axios client so that users of this instance can make requests 
   */
  get client(): AxiosInstance {
    return this.axiosClient;
  }
}
