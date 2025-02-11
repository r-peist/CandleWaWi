import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import { validateData } from "../../validation/validate";
import * as Errors from "../../error/errors";

export const handlerInventar = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {

  let connection;

  const inventar: Array<{
    Material: string; Kategorie: string; MaterialKategorie: string;
    Lager: string; Menge: number; Status: string
  }> = [];

  try {
    // Verbindung zur Datenbank herstellen
    connection = await getConnection();

    // SQL-Abfrage, um MatID, LagerID und Menge aus der Tabelle `materiallager` zu lesen
    const query = `
        SELECT MatID, LagerID, Menge
        FROM materiallager
    `;
    const [rows]: any = await connection.execute(query);

    // Zwischenspeichern der Daten
    const materialLager = rows.map((row: any) => ({
      MatID: row.MatID,
      LagerID: row.LagerID,
      Menge: row.Menge,
    }));

    for (let i = 0; i < materialLager.length; i++ ) {
        const { MatID, LagerID, Menge } = materialLager[i];

        // Abfrage für material Tabelle
        const queryMat = `
            SELECT KatID, MatKatID, Active, Name
            FROM material
            WHERE MatID=?
        `;

        const [matrows]: any = await connection.execute(queryMat, [MatID]);

        // Zwischenspeichern der Daten
        const material = matrows.map((row: any) => ({
            KatID: row.KatID,
            MatKatID: row.MatKatID,
            Active: row.Active,
            Name: row.Name
        }));

        const materialname = material[0].Name;

        const active = material[0].Active;
        let status;
        if (active) {
            status = "Aktiv";
        } else {
            status = "Inaktiv";
        }

        //Abfrage für Kategorie
        const queryKat = `
            SELECT Name
            FROM kategorie
            WHERE KatID=?
        `;

        const [katrows]: any = await connection.execute(queryKat, [material[0].KatID]);

        const kategorie = katrows.map((row: any) => ({
            Name: row.Name
        }));

        const kategoriename = kategorie[0].Name;
    
        //Abfrage für Material Kategorie
        const queryMatKat = `
            SELECT Name
            FROM materialkategorie
            WHERE MatKatID=?
        `;

        const [matkatrows]: any = await connection.execute(queryMatKat, [material[0].MatKatID]);

        const materialkategorie = matkatrows.map((row: any) => ({
            Name: row.Name
        }));

        const materialkategoriename = materialkategorie[0].Name;

        //Abfrage Lagername
        const queryLager = `
            SELECT Name
            FROM lager
            WHERE LagerID=?
        `;

        const [lagerrows]: any = await connection.execute(queryLager, [materialLager[i].LagerID]);

        const lager = lagerrows.map((row: any) => ({
            Name: row.Name
        }));

        const lagername = lager[0].Name;

        inventar.push({
            Material: materialname,
            Kategorie: kategoriename,
            MaterialKategorie: materialkategoriename,
            Lager: lagername,
            Menge: materialLager[i].Menge,
            Status: active
        })
    }

    const inventarObject = {Inventar: inventar};

    const validatedData = validateData("inventorySchema", inventarObject);

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
