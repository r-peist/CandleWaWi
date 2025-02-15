import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import * as Errors from "../error/errors";

export const responseSender = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // JSON-Daten aus dem Request-Body lesen
    const data = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    console.log("Erhaltene Daten im responseSender: ");
    console.dir(data, { depth: null, colors: true });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Daten erfolgreich ans FE gesendet",
        data, // Die empfangenen Daten werden direkt zurückgegeben
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "responseSender");
  }
};
