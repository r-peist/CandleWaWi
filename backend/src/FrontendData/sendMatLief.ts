import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

//Endpunkt im Frontend ist "sendLieferanten"
export const sendMatLief = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // JSON-Daten aus dem Request-Body lesen
    const matLief = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    //const { matLief } = JSON.parse(event.body || "{}");
    console.log("Gesendete Daten von DB Handler: ", matLief);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Material-Lieferantenrequest erhalten und Daten erfolgreich gesendet",
        matLief
        //receivedData: requestLieferanten, // Zurück an das Frontend
      }),
    };
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Material-Lieferantenanfrage:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler beim Verarbeiten der Material-Lieferantenanfrage",
      }),
    };
  }
};