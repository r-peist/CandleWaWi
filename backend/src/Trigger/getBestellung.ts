import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import fetch from "node-fetch";

export const getBestellung = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Überprüfen, ob der Body korrekt ist
    const bestellung = JSON.parse(event.body || "{}");
    console.log("Empfangener Body aus dem Frontend für Bestellung:", bestellung);

    // HTTP-Post-Aufruf mit node-fetch
        const response = await fetch("http://localhost:3001/handlerBestellung", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bestellung }),
        });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("Fehler aus `getBestellung`:", responseBody);
      throw new Error(`Backend-Fehler: ${responseBody.error || response.status}`);
    }

    console.log("Daten aus `getMatLief`:", responseBody);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Bestelldaten erfolgreich vom FE erhalten und verarbeitet!",
        data: responseBody.data,
      }),
    };
  } catch (error) {
    console.error("Fehler in `getBestellung`:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler beim Verarbeiten der Anfrage!",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
    };
  }
};
