import { DynamoDocumentClient } from "./DynamoDB"

export abstract class DynamoClient {
  table: string

  get client() {
    return DynamoDocumentClient
  }

  constructor(tableSuffix: string) {
    this.table = 'covidbooking-' + tableSuffix
  }
}