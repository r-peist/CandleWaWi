import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import * as Errors from "../error/errors";
import lieferanten from "../responseSender/JSONs/handlergetLieferanten.json";

export const responseSender = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const data = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    console.log("Lieferanten:", lieferanten);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Daten erfolgreich ans FE gesendet",
        data,
        lieferanten,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "responseSender");
  }
};
