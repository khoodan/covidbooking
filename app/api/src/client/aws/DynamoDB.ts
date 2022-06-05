import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, TranslateConfig } from "@aws-sdk/lib-dynamodb";

export const DynamoDocumentClientCreator = () => {
  const ddbClient = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  const translateConfig: TranslateConfig = {
    marshallOptions: {

    },
    unmarshallOptions: {

    }
  }

  return DynamoDBDocumentClient.from(ddbClient, translateConfig)
}

export const DynamoDocumentClient = DynamoDocumentClientCreator()