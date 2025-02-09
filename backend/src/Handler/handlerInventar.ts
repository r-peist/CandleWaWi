import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import { validateInventar } from "../validizer/functions/validizeInventar"

export const handlerInventar = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {

  const requestBody = event.body ? JSON.parse(event.body) : {};

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

    console.log("Materialdaten aus `materiallager`:", materialLager);

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
    console.log("handlerInventory JSON: ", inventarObject);

    const validData = validateInventar(inventarObject);

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("http://localhost:3001/sendInventar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( validData ),
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
        data: rows,
        response: responseBody,
      }),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fehler bei Sendung des Inventars an sendInventory:", error.message);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Fehler bei Sendung des Inventars an sendInventory mit Error Typpiesierung",
          error: error.message,
        }),
      };
    } else {
      console.error("Unbekannter Fehler:", error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Fehler bei Sendung des Inventars an sendInventory ohne Error Typpiesierung",
          error: "Ein unbekannter Fehler ist aufgetreten bei Sendung des Inventars an sendInventory.",
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
