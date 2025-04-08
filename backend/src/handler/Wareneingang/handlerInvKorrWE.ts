import { APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
import * as Errors from "../../error/errors";
import { ValidatedEvent } from "../../interfaces";

export const handlerInvKorrWE = async (
    event: ValidatedEvent<{
      InvKorrWE: {
        Kommentar: string;
        Datum: string;
        Benutzer: string;
        BestellID: number;
      };
    }>
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    const {
      InvKorrWE: { Kommentar, Datum, Benutzer, BestellID },
    } = event.validatedBody;

    console.log("Daten aus FE:", Kommentar, Datum, Benutzer, BestellID);

    connection = await getConnection();
    await connection.beginTransaction();

    // Bestellung auf 'pruefung' setzen
    await connection.query(
        `
      UPDATE bestellung
      SET status = 'pruefung'
      WHERE BestellID = ?;
    `,
        [BestellID]
    );

    // Neue Inventarkorrektur eintragen
    const [result]: any = await connection.query(
        `
      INSERT INTO inventarkorrektur (Kommentar, Datum, Benutzer, Status, Typ)
      VALUES (?, ?, ?, 'offen', 'bestellung');
    `,
        [Kommentar, Datum, Benutzer]
    );

    const invKorrID = result.insertId;

    // Wareneingang-Korrektur verknüpfen
    await connection.query(
        `
      INSERT INTO invkorr_wareneingang (InvKorrWEID, BestellID)
      VALUES (?, ?);
    `,
        [invKorrID, BestellID]
    );

    await connection.commit();

    const responseData = {
      Status: {
        success: true,
        message: "Bestellung erfolgreich zur Prüfung markiert und Korrektur angelegt.",
        data: invKorrID,
      },
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Inventarkorrektur erfolgreich gespeichert.",
        data: responseData,
      }),
    };
  } catch (error) {
    if (connection) await connection.rollback();
    return Errors.handleError(error, "handlerInvKorrWE");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
