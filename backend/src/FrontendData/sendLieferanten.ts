import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

//Endpunkt im Frontend ist "sendLieferanten"
export const sendLieferanten = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // JSON-Daten aus dem Request-Body lesen
    const { sendLieferanten } = JSON.parse(event.body || "{}");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lieferantenrequest erhalten und Daten erfolgreich gesendet",
        sendLieferanten
        //receivedData: requestLieferanten, // Zurück an das Frontend
      }),
    };
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Lieferantenanfrage:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler beim Verarbeiten der Lieferantenanfrage",
      }),
    };
  }
};