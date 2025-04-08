import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import * as Errors from "../../error/errors";
import { ValidatedEvent } from "../../interfaces";
import { validateData } from "../../validation/validate";

export const handlerMatLief = async (
  event: ValidatedEvent<{Lieferant: {LiefID: number}}>
  ): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    // JSON-Daten aus dem Request-Body lesen
    const { Lieferant: { LiefID }} = event.validatedBody;
    const liefID = LiefID;
    console.log("Empfangene LiefID:", liefID);

    // Verbindung zur Datenbank herstellen
    connection = await getConnection();

    // SQL-Abfrage mit Joins, um MaterialName und LieferantName abzurufen
    const [rows] = await connection.query(
      `
      SELECT 
        ml.MatLiefID,
        ml.MatID,
        ml.LiefID,
        ml.Link,
        m.Name AS MaterialName,
        l.Name AS LieferantName
      FROM materiallieferant ml
      INNER JOIN material m ON ml.MatID = m.MatID
      INNER JOIN lieferant l ON ml.LiefID = l.LiefID
      WHERE ml.LiefID = ?
    `,
      [liefID]
    );

    const MatLiefs = { MatLiefs: rows };

    //Validierung des JSONs
    const validatedData = validateData("matLiefSchema", MatLiefs);

    //console.log("Validierte Daten in handler: ", validatedData);

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/responseSender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( validatedData ),
    });

    const responseBody = await response.json();

    // Erfolgreiche Antwort mit Abfrageergebnissen
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Datenbank-Abfrage erfolgreich!",
        data: validatedData,
        response: responseBody,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerGetMatLief");
  } finally {
    // Verbindung freigeben
    if (connection) {
      connection.release();
    }
    await closePool();
  }
};
