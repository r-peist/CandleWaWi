import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const sendInventar = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // JSON-Daten aus dem Request-Body lesen
    const sendInventar = JSON.parse(event.body || "{}");
    console.log("Erhaltene Daten in sendBestellung: ", sendInventar);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Inventar erhalten und Daten erfolgreich ans FE gesendet",
        sendInventar, // Die empfangenen Daten werden direkt zurückgegeben
      }),
    };
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Inventarsendung:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler beim Verarbeiten der Inventarsendung",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
    };
  }
};