import { APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import * as Errors from "../../error/errors";
import { ValidatedEvent } from "../../interfaces";

export const handlerInvKorrWE = async (
  event: ValidatedEvent<{InvKorrWE: {Kommentar: string, Datum: string, Benutzer: string, BestellID: number}}>
  ): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    // JSON-Daten aus dem Request-Body lesen
    const { InvKorrWE: { Kommentar, Datum, Benutzer, BestellID }} = event.validatedBody;
    console.log("Daten aus FE: ", Kommentar, Datum, Benutzer, BestellID);

    // Verbindung zur Datenbank herstellen
    connection = await getConnection();

    // Transaktion starten
    await connection.beginTransaction();

    // Bestellung auf pruefung setzen
    await connection.query(
        `UPDATE bestellung
        SET status = 'pruefung'
        WHERE BestellID = ?;`,
        [BestellID]
    );

    // Hier fangen wir das Ergebnis der INSERT-Abfrage ab, um die generierte InvKorrID zu erhalten
    const [result]: any = await connection.query(
        `INSERT INTO inventarkorrektur (Kommentar, Datum, Benutzer, Status, Typ)
         VALUES (?, ?, ?, 'offen', 'bestellung');`,
        [Kommentar, Datum, Benutzer]
    );
    const invKorrID = result.insertId;

    // Neue Materialien ins Lager einfügen, falls sie noch nicht existieren
    await connection.query(
        `INSERT INTO invkorr_wareneingang (InvKorrWEID, BestellID)
        VALUES (?, ?);
        `,
        [invKorrID, BestellID]
    );

    // Transaktion committen
    await connection.commit();

    // Erfolgreiche Antwort zurückgeben
    const responseDB = { Status: {success: true, message: "Bestellung erfolgreich abgeschlossen und Lager aktualisiert", data: invKorrID }};

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
