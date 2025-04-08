import { APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import * as Errors from "../../error/errors";
import { ValidatedEvent } from "../../interfaces";

export const handlerBuchung = async (
  event: ValidatedEvent<{Buchung: {BestellID: number}}>
  ): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    // JSON-Daten aus dem Request-Body lesen
    const { Buchung: { BestellID }} = event.validatedBody;
    const bestellID = BestellID;
    console.log("Empfangene LiefID:", bestellID);

    // Verbindung zur Datenbank herstellen
    connection = await getConnection();

    // Transaktion starten
    await connection.beginTransaction();

    // Bestellung als "abgeschlossen" markieren
    await connection.query(
        `UPDATE bestellung
         SET status = 'abgeschlossen'
         WHERE BestellID = ?;`,
        [bestellID]
    );

    // Bestehende Materialmengen im Lager aktualisieren
    await connection.query(
        `UPDATE materiallager ml
         JOIN materialbestellung mb ON ml.MatID = mb.MatID
         JOIN bestellung b ON mb.BestellID = b.BestellID
         SET ml.Menge = ml.Menge + mb.Menge
         WHERE b.BestellID = ?;`,
        [bestellID]
    );

    // Neue Materialien ins Lager einfügen, falls sie noch nicht existieren
    await connection.query(
        `INSERT INTO materiallager (MatID, LagerID, Menge)
         SELECT mb.MatID, b.LagerID, mb.Menge
         FROM materialbestellung mb
         JOIN bestellung b ON mb.BestellID = b.BestellID
         LEFT JOIN materiallager ml ON mb.MatID = ml.MatID AND b.LagerID = ml.LagerID
         WHERE b.BestellID = ? AND ml.MatID IS NULL;`,
        [bestellID]
    );

    // Transaktion committen
    await connection.commit();

    // Erfolgreiche Antwort zurückgeben
    const responseDB = { Status: {success: true, message: "Bestellung erfolgreich abgeschlossen und Lager aktualisiert" }};

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/responseSender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( responseDB ),
    });

    const responseBody = await response.json();

    // Erfolgreiche Antwort mit Abfrageergebnissen
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Datenbank-Abfrage erfolgreich!",
        data: responseDB,
        response: responseBody,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerBuchung");
  } finally {
    // Verbindung freigeben
    if (connection) {
      connection.release();
    }
    await closePool();
  }
};
