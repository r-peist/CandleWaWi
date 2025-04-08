import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
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
        ml.Menge,
        b.BehaelterID,
        b.Name AS Behaeltername,
        de.DeckelID,
        de.Name AS Deckelname,
        do.DochtID,
        do.Name AS Dochtname,
        w.WarnEttID,
        w.Name as Warnettikettname
      FROM material m
      JOIN materialkategorie mk ON m.MatKatID = mk.MatKatID
      JOIN materiallager ml ON m.MatID = ml.MatID
      JOIN lager l ON l.LagerID = ml.LagerID
      LEFT JOIN behaelter b ON m.MatID = b.MatID
      LEFT JOIN deckel de ON m.MatID = de.MatID
      LEFT JOIN docht do ON m.MatID = do.MatID
      LEFT JOIN warnettikett w ON m.MatID = w.MatID
      ORDER BY m.MatKatID
    `);

    const Inventar = rows.reduce((acc: any, row: any) => {
      let kategorie = acc.find((k: any) => k.MatKatID === row.MatKatID);

      if (!kategorie) {
        kategorie = {
          MatKatID: row.MatKatID,
          Kategorie: row.Kategorie,
          Materialien: [],
        };
        acc.push(kategorie);
      }

      const materialObj: any = {
        MatID: row.MatID,
        Materialname: row.Materialname,
        SKU: row.SKU,
        Active: row.Active,
        LagerID: row.LagerID,
        Lagername: row.Lagername,
        Menge: row.Menge,
      };

      if ([3].includes(row.MatKatID)) {
        Object.assign(materialObj, {
          DochtID: row.DochtID,
          Dochtname: row.Dochtname,
        });
      } else if ([4].includes(row.MatKatID)) {
        Object.assign(materialObj, {
          BehaelterID: row.BehaelterID,
          Behaeltername: row.Behaeltername,
        });
      } else if ([11].includes(row.MatKatID)) {
        Object.assign(materialObj, {
          DeckelID: row.DeckelID,
          Deckelname: row.Deckelname,
        });
      } else if ([12].includes(row.MatKatID)) {
        Object.assign(materialObj, {
          WarnEttID: row.WarnEttID,
          Warnettikettname: row.Warnettikettname,
        });
      }

      kategorie.Materialien.push(materialObj);
      return acc;
    }, []);

    const inventarObject = { Inventar };
    const validatedData = validateData("inventarSchema", inventarObject);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Inventar erfolgreich geladen.",
        data: validatedData,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerInventar");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
