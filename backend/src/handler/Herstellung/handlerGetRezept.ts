import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
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

    rezeptKerze = kerzerows;

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
        z2.Name as ZP_name2
      FROM rezeptspraydif rs
      JOIN behaelter b ON rs.BehaelterID = b.BehaelterID
      JOIN deckel de ON rs.DeckelID = de.DeckelID
      JOIN warnettikett w ON rs.WarnEttID = w.WarnEttID
      LEFT JOIN zwischenproduktrezept z ON rs.ZPRezeptID1 = z.ZPRezeptID
      LEFT JOIN zwischenproduktrezept z2 ON rs.ZPRezeptID2 = z2.ZPRezeptID
    `);

    rezeptSprayDiff = spraydiffrows;

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
      const [matrows]: any = await connection.query(`
        SELECT
          z.MatID,
          m.Name,
          z.Menge
        FROM rezeptzutaten z
        JOIN material m ON z.MatID = m.MatID
        WHERE z.ZPRezeptID = ?
      `, [zp.ZPRezeptID]);

      rezeptZP.push({
        ZPRezeptID: zp.ZPRezeptID,
        Name: zp.Name,
        Beschreibung: zp.Beschreibung,
        Releasedate: zp.Releasedate,
        Changedate: zp.Changedate,
        Zutaten: matrows
      });
    }

    const rezept = { Rezept: { Kerze: rezeptKerze, SprayDiff: rezeptSprayDiff, ZP: rezeptZP } };
    const validatedData = validateData("rezepteSchema", rezept);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Rezepte erfolgreich geladen.",
        data: validatedData
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerGetRezept");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
