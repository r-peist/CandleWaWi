import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf

export const getLieferanten = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    // Verbindung zur Datenbank herstellen
    connection = await getConnection();

    // Beispiel-Abfrage: Tabelleninformationen abrufen
    const [rows] = await connection.query("SELECT * FROM lieferant");

    const lieferanten = JSON.stringify(rows);

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("http://localhost:3001/sendLieferanten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sendLieferanten: lieferanten }),
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler: ${response.status}`);
    }

    const responseBody = await response.json();

    // Erfolgreiche Antwort mit Abfrageergebnissen
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Datenbank-Abfrage der Lieferanten erfolgreich!",
        data: rows,
        response: responseBody,
      }),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Datenbankfehler Lieferanten:", error.message);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Fehler bei der Datenbankabfrage mit Error Typpiesierung",
          error: error.message,
        }),
      };
    } else {
      console.error("Unbekannter Fehler:", error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Fehler bei der Datenbankabfrage ohne Error Typpiesierung",
          error: "Ein unbekannter Fehler ist aufgetreten.",
        }),
      };
    }
  } finally {
    // Verbindung freigeben
    if (connection) {
      connection.release();
    }
    await closePool();
  }
};
