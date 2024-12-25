import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const sendLieferanten = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // JSON-Daten aus dem Request-Body lesen
    const { sendLieferanten } = JSON.parse(event.body || "{}");
    console.log("Empfangene Daten:", sendLieferanten);

    // Daten direkt an das Frontend zurücksenden
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Daten erfolgreich empfangen und an Frontend gesendet",
        data: sendLieferanten, // Hier werden die empfangenen Daten zurückgesendet
      }),
    };
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Anfrage:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler beim Verarbeiten der Anfrage",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
    };
  }
};
