import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import * as Errors from "../../error/errors";
import { InvKorrMats, InvKorrBest, MaterialInvKorr } from "../../interfaces";
import { validateData } from "../../validation/validate";
import { json } from "stream/consumers";

export const handlerGetInvKorr = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    let invKorrMatsArr: InvKorrMats[] = [];
    let invKorrBestArr: InvKorrBest[] = [];
    let material: MaterialInvKorr[] = [];
        
    // Verbindung zur Datenbank herstellen
    connection = await getConnection();

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

    for (const korrMats of korrMatrows) {
      const { MatID, Name, Menge, neue_Menge, Kommentar, Datum, Benutzer } = korrMats;
      invKorrMatsArr.push(korrMats);
    }

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
        `, [BestellID]
      );

      for (const mats of materialrows) {
        const { MatID, Name, Menge, neue_Menge } = mats;
        material.push(mats);
      }
      invKorrBestArr.push({
        BestellID: BestellID, 
        Kommentar: Kommentar, 
        Datum: Datum,
        Benutzer: Benutzer,
        Material: material
      });
    }
    
    const inventarkorrektur = {Inventarkorrektur: { InvKorrMats: invKorrMatsArr, InvKorrBest: invKorrBestArr }};
    const validatedData = validateData("getInvKorrSchema", inventarkorrektur);

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("http://localhost:3001/responseSender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const responseBody = await response.json();

    // Erfolgreiche Antwort mit Abfrageergebnissen
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Datenbank-Abfrage der Lieferanten erfolgreich!",
        data: validatedData,
        response: responseBody,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerGetLieferanten");
  } finally {
    // Verbindung freigeben
    if (connection) {
      connection.release();
    }
    await closePool();
  }
};
