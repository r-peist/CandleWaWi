import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import * as Errors from "../../error/errors";
import { validateData } from "../../validation/validate";
import { RezeptKerze, RezeptSprayDiff, RezeptZP, Zutaten } from "../../interfaces";

export const handlerGetRezept = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {    
    let rezeptKerze: RezeptKerze[] = [];
    let rezeptSprayDiff: RezeptSprayDiff[] = [];
    let rezeptZP: RezeptZP[] = [];
    let zutaten: Zutaten[] = [];

    // Verbindung zur Datenbank herstellen
    connection = await getConnection();

    const [kerzerows]: any = await connection.query(`
      SELECT
        rk.RezeptKerzeID,
        rk.Name,
        rk.MatID,
        m.Name as Name_Mat,
        rk.BehaelterID,
        b.Name as Behaelter_name,
        rk.DeckelID,
        de.Name as Deckel_name,
        rk.DochtID,
        do.Name as Docht_name,
        rk.WarnEttID,
        w.Name as WarnEtt_name,
        rk.ZPRezeptID,
        z.Name as ZP_name
      FROM rezeptkerze rk
      JOIN material m ON rk.MatID = m.MatID
      JOIN behaelter b ON rk.BehaelterID = b.BehaelterID
      JOIN deckel de ON rk.DeckelID = de.DeckelID
      JOIN docht do ON rk.DochtID = do.DochtID
      JOIN warnettikett w ON rk.WarnEttID = w.WarnEttID
      JOIN zwischenproduktrezept z ON rk.ZPRezeptID = z.ZPRezeptID
    `);

    for (const kerze of kerzerows) {
      const { RezeptKerzeID, Name, MatID, Name_Mat, BehaelterID, Behaelter_name, DeckelID, Deckel_name,
              WarnEttID, WarnEtt_name, ZPRezeptID, ZP_name } = kerze;
      rezeptKerze.push(kerze);
    }

    const [spraydiffrows]: any = await connection.query(`
      SELECT
        rs.RezeptSprayDifID,
        rs.Name,
        rs.BehaelterID,
        b.Name as Behaelter_name,
        rs.DeckelID,
        de.Name as Deckel_name,
        rs.WarnEttID,
        w.Name as WarnEtt_name,
        rs.ZPRezeptID1,
        z.Name as ZP_name1,
        rs.ZPRezeptID2,
        z.Name as ZP_name2
      FROM rezeptspraydif rs
      JOIN behaelter b ON rs.BehaelterID = b.BehaelterID
      JOIN deckel de ON rs.DeckelID = de.DeckelID
      JOIN warnettikett w ON rs.WarnEttID = w.WarnEttID
      JOIN zwischenproduktrezept z ON rs.ZPRezeptID1 = z.ZPRezeptID OR rs.ZPRezeptID2 = z.ZPRezeptID
    `);

    for (const spraydiff of spraydiffrows) {
      const { RezeptSprayDifID, Name, BehaelterID, Behaelter_name, DeckelID, Deckel_name, ZPRezeptID1,
              ZP_name1, ZPRezeptID2, ZP_name2 } = spraydiff;
      rezeptSprayDiff.push(spraydiff);
    }

    const [zprows]: any = await connection.query(`
      SELECT
        z.ZPRezeptID,
        z.Name,
        z.Beschreibung,
        z.Erstellungsdatum AS Releasedate,
        z.Änderungsdatum AS Changedate
      FROM zwischenproduktrezept z
    `);

    for (const zp of zprows) {
      const { ZPRezeptID, Name, Beschreibung, Releasedate, Changedate } = zp;
      const [matrows]: any = await connection.query(`
        SELECT
          z.MatID,
          m.Name,
          z.Menge
        FROM rezeptzutaten z
        JOIN material m ON z.MatID = m.MatID
        WHERE RezeptZutatenID = ?
      `, [ZPRezeptID]);
      for (const mat of matrows) {
        const { MatID, Name, Menge } = mat
        zutaten.push(mat);
      }
      rezeptZP.push({
        ZPRezeptID: ZPRezeptID,
        Name: Name,
        Beschreibung: Beschreibung,
        Releasedate: Releasedate,
        Changedate: Changedate,
        Zutaten: zutaten
      });
    }

    const rezept = { Rezept: { Kerze: rezeptKerze, SprayDiff: rezeptSprayDiff, ZP: rezeptZP }};
    console.log(rezept);
    const validatedData = validateData("rezepteSchema", rezept);

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
