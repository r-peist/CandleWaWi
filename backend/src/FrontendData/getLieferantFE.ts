import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import fetch from "node-fetch"; // Für HTTP Aufruf

export const getLieferantFE = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Daten aus dem Request-Body extrahieren
    const receivedLief = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    console.log("Empfangene Daten:", receivedLief);

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("http://localhost:3001/getMatLief", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receivedLief), // JSON-Daten als Body
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler: ${response.status}`);
    }

    const responseBody = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Daten erfolgreich empfangen und zwischengespeichert (MatLief)",
        forwardedResponse: responseBody, // Antwort von getMatLief
      }),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fehler beim Verarbeiten der Anfrage:", error.message);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Fehler beim Verarbeiten der Anfrage (MatLief) mit Error Typpiesierung",
          error: error.message,
        }),
      };
    } else {
      console.error("Unbekannter Fehler:", error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Fehler beim Verarbeiten der Anfrage (MatLief) ohne Error Typpiesierung",
          error: "Ein unbekannter Fehler ist aufgetreten.",
        }),
      };
    }
  }
};
