import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../db/dbclient"; // Importiere den DB-Wrapper
import { sendLieferanten } from "../FrontendData/sendLieferanten";
import axios from "axios"; //Für HTTP Aufruf

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

    const response = await axios.post(
      "http://localhost:3001/sendLieferanten",
      // der Funktion sendLieferanten werden Daten übergeben
      { sendLieferanten: lieferanten }
    );

    // Erfolgreiche Antwort mit Abfrageergebnissen
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Datenbank-Abfrage erfolgreich!",
        data: rows,
      }),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Datenbankfehler:", error.message);
   
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
