import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import fetch from "node-fetch";

export const getLieferantFE = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Überprüfen, ob der Body korrekt ist
    const body = JSON.parse(event.body || "{}");
    console.log("Empfangener Body aus dem Frontend:", body);

    const LiefID = body.LiefID; // Extrahiere LiefID
    if (!LiefID) {
      throw new Error("LiefID fehlt oder ist undefined!");
    }

    console.log("Extrahierte LiefID:", LiefID);

    const response = await fetch("http://localhost:3001/getMatLief", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ LiefID }), // LiefID an Backend senden
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("Fehler aus `getMatLief`:", responseBody);
      throw new Error(`Backend-Fehler: ${responseBody.error || response.status}`);
    }

    console.log("Daten aus `getMatLief`:", responseBody);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Erfolgreich verarbeitet!",
        data: responseBody.data,
      }),
    };
  } catch (error) {
    console.error("Fehler in `getLieferantFE`:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler beim Verarbeiten der Anfrage!",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
    };
  }
};
