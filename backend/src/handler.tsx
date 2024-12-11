import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const hello = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Local server is running!" }),
  };
};

