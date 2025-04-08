import { APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../../db/dbclient";
import * as Errors from "../../../error/errors";
import { validateData } from "../../../validation/validate";
import { ValidatedEvent } from "../../../interfaces";
import {herstellenSchema} from "../../../validation/schemata";

export const handlerHerstellung = async (
    event: ValidatedEvent<{
      Rezept: {
        Name: string;
        RezeptID: number;
        BehaelterID: number;
        DeckelID: number;
        MatID: number;
        Menge: number;
        Materialien: [];
      };
    }>
): Promise<APIGatewayProxyResult> => {
  let connection;
  const {
    Rezept: { Name, RezeptID, BehaelterID, DeckelID, MatID, Menge, Materialien = [] },
  } = event.validatedBody;
  let mats: any[] = [];

  try {
    connection = await getConnection();
    await connection.beginTransaction();

    if (Name === "Kerze") {
      const [behaelterrows]: any = await connection.query(
          `SELECT MatID AS BehaelterMatID FROM behaelter WHERE BehaelterID = ?`,
          [BehaelterID]
      );

      const [deckelrows]: any = await connection.query(
          `SELECT MatID AS DeckelMatID FROM deckel WHERE DeckelID = ?`,
          [DeckelID]
      );

      // Base mats
      mats.push(
          { MatID, Menge },
          { MatID: parseInt(behaelterrows[0].BehaelterMatID), Menge },
          { MatID: parseInt(deckelrows[0].DeckelMatID), Menge }
      );

      for (const m of Materialien) {
        mats.push(m);
      }

      for (const row of mats) {
        await connection.query(
            `UPDATE materiallager SET Menge = Menge - COALESCE(?, 0) WHERE MatID = ?`,
            [row.Menge, row.MatID]
        );
      }
    } else if (Name === "SprayDiff") {
      // Logik für SprayDiff hier rein, wenn gebraucht
    } else if (Name === "ZP") {
      // Logik für ZP hier rein, wenn gebraucht
    }

    await connection.commit();

    const resultData = {
      Herstellung: {
        success: true,
        message: `Herstellung für Rezept "${Name}" erfolgreich verarbeitet.`,
        verwendeteMaterialien: mats,
      },
    };

    const validated = validateData("herstellenSchema", resultData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Herstellung erfolgreich abgeschlossen",
        data: validated,
      }),
    };
  } catch (error) {
    if (connection) await connection.rollback();
    return Errors.handleError(error, "handlerHerstellung");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
