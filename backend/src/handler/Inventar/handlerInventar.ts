import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import { validateData } from "../../validation/validate";
import * as Errors from "../../error/errors";

export const handlerInventar = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {

  let connection;

  try {
    connection = await getConnection();

    const [rows]: any = await connection.query(`
      SELECT
        m.MatKatID,
        mk.Name AS Kategorie,
        m.MatID,
        m.Name AS Materialname,
        m.SKU,
        m.Active,
        ml.LagerID,
        l.Name AS Lagername,
        ml.Menge
      FROM material m
      JOIN materialkategorie mk ON m.MatKatID = mk.MatKatID
      JOIN materiallager ml ON m.MatID = ml.MatID
      JOIN lager l ON l.LagerID = ml.LagerID
      ORDER BY m.MatKatID  
    `);

    // 🔥 JSON strukturieren (Gruppieren nach MatKatID)
    const Inventar = rows.reduce((acc: any, row: any) => {
      let kategorie = acc.find((k: any) => k.MatKatID === row.MatKatID);

      if (!kategorie) {
        kategorie = {
          MatKatID: row.MatKatID,
          Kategorie: row.Kategorie,
          Materialien: []
        };
        acc.push(kategorie);
      }

      kategorie.Materialien.push({
        MatID: row.MatID,
        Materialname: row.Materialname,
        SKU: row.SKU,
        Active: row.Active,
        LagerID: row.LagerID,
        Lagername: row.Lagername,
        Menge: row.Menge
      });

      return acc;
    }, []);
    
    const inventarObject = { Inventar };
    const validatedData = validateData("inventarSchema", inventarObject);

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("http://localhost:3001/responseSender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( validatedData ),
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler: ${response.status}`);
    }

    const responseBody = await response.json();

    // Erfolgreiche Antwort mit Abfrageergebnissen
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Datenbank-Abfrage des Inventars an sendInventory geschickt.",
        data: validatedData,
        response: responseBody,
      }),
    };
  } catch (error) {
    return Errors.handleError(error);
  } finally {
    // Verbindung freigeben
    if (connection) {
      connection.release();
    }
    await closePool();
  }
};
