import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const sendBestellung = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // JSON-Daten aus dem Request-Body lesen
    const sendBestellung = JSON.parse(event.body || "{}");
    console.log("Erhaltene Daten in sendBestellung: ", sendBestellung);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Bestellung erhalten, gespeichert und Daten erfolgreich ans FE gesendet",
        sendBestellung, // Die empfangenen Daten werden direkt zurückgegeben
      }),
    };
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Bestellungssendung:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler beim Verarbeiten der Bestellungssendung",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
    };
  }
};