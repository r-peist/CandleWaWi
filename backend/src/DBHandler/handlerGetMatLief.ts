import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../db/dbclient"; // Importiere den DB-Wrapper
import axios from "axios"; //Für HTTP Aufruf

export const getMatLief = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let connection;

  // JSON-Daten aus dem Request-Body lesen
  //const lieferant = JSON.parse(event.body || "{}");
  const lieferant = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  console.log("Empfangene Daten:", lieferant);

    // Zugriff auf das Feld LiefID
  const parsedData = lieferant; // Den String "getMatLief" in ein Objekt umwandeln
  const liefID = lieferant?.LiefID; // Nur das Feld LiefID extrahieren

  try {
    // Verbindung zur Datenbank herstellen
    connection = await getConnection();

    // Beispiel-Abfrage: Tabelleninformationen abrufen
    const [rows] = await connection.query("SELECT * FROM materiallieferant WHERE LiefID = " + liefID);

    const matLief = JSON.stringify(rows);

    console.log(matLief);

    const response = await axios.post(
      "http://localhost:3001/sendMatLief",
      // der Funktion sendLieferanten werden Daten übergeben
      matLief,
      { headers: {
        "Content-Type": "application/json",
      } // JSON-Daten als Body
    });

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
