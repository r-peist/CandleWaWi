import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
import * as Errors from "../../error/errors";
import { InvKorrMats, InvKorrBest, MaterialInvKorr } from "../../interfaces";
import { validateData } from "../../validation/validate";

export const handlerGetInvKorr = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    let invKorrMatsArr: InvKorrMats[] = [];
    let invKorrBestArr: InvKorrBest[] = [];

    connection = await getConnection();

    // Materialien ohne Bestellungen
    const [korrMatrows]: any = await connection.query(`
      SELECT 
          im.MatID,
          m.Name,
          im.Menge,
          (ml.Menge - im.Menge) AS neue_Menge,
          ik.Kommentar,
          ik.Datum,
          ik.Benutzer
      FROM invkorr_material im
      JOIN inventarkorrektur ik ON im.InvKorrMatID = ik.InvKorrID
      JOIN material m ON im.MatID = m.MatID
      JOIN materiallager ml ON im.MatID = ml.MatID
      WHERE ik.Typ = 'Material';
    `);

    invKorrMatsArr = korrMatrows;

    // Materialien mit Bezug zu Bestellungen
    const [korrBestrows]: any = await connection.query(`
      SELECT 
        b.BestellID,
        ik.Kommentar,
        ik.Datum,
        ik.Benutzer
      FROM bestellung b
      JOIN invkorr_wareneingang iw ON b.BestellID = iw.BestellID
      JOIN inventarkorrektur ik ON iw.InvKorrWEID = ik.InvKorrID
      WHERE b.status = 'pruefung' AND ik.Typ = 'Bestellung';
    `);

    for (const korrBest of korrBestrows) {
      const { BestellID, Kommentar, Datum, Benutzer } = korrBest;

      const [materialrows]: any = await connection.query(`
        SELECT 
          mb.MatID,
          m.Name,
          mb.Menge,
          (ml.Menge - mb.Menge) AS neue_Menge
        FROM materialbestellung mb
        JOIN material m ON mb.MatID = m.MatID
        JOIN materiallager ml ON mb.MatID = ml.MatID
        WHERE mb.BestellID = ?;
      `, [BestellID]);

      invKorrBestArr.push({
        BestellID,
        Kommentar,
        Datum,
        Benutzer,
        Material: materialrows,
      });
    }

    const inventarkorrektur = {
      Inventarkorrektur: {
        InvKorrMats: invKorrMatsArr,
        InvKorrBest: invKorrBestArr,
      },
    };

    const validatedData = validateData("getInvKorrSchema", inventarkorrektur);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Inventarkorrektur erfolgreich geladen.",
        data: validatedData,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerGetInvKorr");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
