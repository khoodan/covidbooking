// Create the DynamoDB service client module using ES6 syntax.
import AWS from "aws-sdk";

export const DynamoClientCreator = () => {
  AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  return new AWS.DynamoDB.DocumentClient();
}

export const DynamoDBClient = DynamoClientCreator()