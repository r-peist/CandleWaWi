import { APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
import * as Errors from "../../error/errors";
import { ValidatedEvent } from "../../interfaces";

export const handlerBuchung = async (
    event: ValidatedEvent<{ Buchung: { BestellID: number } }>
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    const { Buchung: { BestellID } } = event.validatedBody;
    console.log("Empfangene BestellID:", BestellID);

    connection = await getConnection();
    await connection.beginTransaction();

    // Bestellung abschließen
    await connection.query(`
      UPDATE bestellung
      SET status = 'abgeschlossen'
      WHERE BestellID = ?;
    `, [BestellID]);

    // Lagerbestand aktualisieren
    await connection.query(`
      UPDATE materiallager ml
      JOIN materialbestellung mb ON ml.MatID = mb.MatID
      JOIN bestellung b ON mb.BestellID = b.BestellID
      SET ml.Menge = ml.Menge + mb.Menge
      WHERE b.BestellID = ?;
    `, [BestellID]);

    // Materialien neu anlegen, falls nicht vorhanden
    await connection.query(`
      INSERT INTO materiallager (MatID, LagerID, Menge)
      SELECT mb.MatID, b.LagerID, mb.Menge
      FROM materialbestellung mb
      JOIN bestellung b ON mb.BestellID = b.BestellID
      LEFT JOIN materiallager ml ON mb.MatID = ml.MatID AND b.LagerID = ml.LagerID
      WHERE b.BestellID = ? AND ml.MatID IS NULL;
    `, [BestellID]);

    await connection.commit();

    const responseData = {
      Status: {
        success: true,
        message: "Bestellung erfolgreich abgeschlossen und Lager aktualisiert",
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Buchung erfolgreich abgeschlossen",
        data: responseData
      }),
    };
  } catch (error) {
    if (connection) await connection.rollback();
    return Errors.handleError(error, "handlerBuchung");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
