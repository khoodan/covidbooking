import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { CreateBookingSchema, BookingSchema } from "@schema/BookingSchema";
import { BookingClient } from "../BookingClient";
import { DynamoClient } from "./DynamoClient";

export class DynamoBookingClient extends DynamoClient implements BookingClient {
  constructor() {
    super('booking')
  }

  async getBookings(): Promise<BookingSchema[]> {
    const params = {
      TableName: this.table,
    };
    const response = await this.client.send(new ScanCommand(params))
    const bookings = response.Items.map(item => unmarshall(item))

    return bookings;
  }

  async addBooking(booking: CreateBookingSchema): Promise<void> {
    await this.client.send(new PutCommand({
      TableName: this.table,
      Item: booking
    }))
  }
}