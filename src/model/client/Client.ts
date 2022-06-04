import { AxiosInstance } from "axios";

/**
 * Base Client interface
 * Defines functionality for all clients
 */
export interface Client {
  /**
   * Getter for the client
   */
  get client(): AxiosInstance;
}