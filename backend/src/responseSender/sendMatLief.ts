import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const sendMatLief = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // JSON-Daten aus dem Request-Body lesen
    const sendMatLief = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    console.log("Erhaltene Daten sind hier: ", sendMatLief);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lieferantenrequest erhalten und Daten erfolgreich gesendet",
        sendMatLief, // Die empfangenen Daten werden direkt zurückgegeben
      }),
    };
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Lieferantenanfrage:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler beim Verarbeiten der Lieferantenanfrage",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
    };
  }
};
