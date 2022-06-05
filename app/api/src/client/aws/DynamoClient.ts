import { DynamoDBClient } from "./DynamoDB";

export abstract class DynamoClient {
  table: string

  get client() {
    return DynamoDBClient
  }

  constructor(tableSuffix: string) {
    this.table = 'covidbooking-' + tableSuffix
  }
}