import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
import * as Errors from "../../error/errors";
import { validateData } from "../../validation/validate";
import { MaterialBest, Bestellung, BestellungenStatus } from "../../interfaces";

export const handlerWareneingang = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let connection;

  const Bestellungen: BestellungenStatus = {
    Wareneingang: {
      offen: [],
      pruefung: []
    }
  };

  try {
    connection = await getConnection();

    const queryBestellungen = `
      SELECT BestellID, LiefID, LagerID, Bestelldatum, Status
      FROM bestellung
      WHERE Status = 'offen' OR Status = 'pruefung'
    `;
    const [bestellRows]: any = await connection.execute(queryBestellungen);

    for (const bestellung of bestellRows) {
      const { BestellID, LiefID, LagerID, Bestelldatum, Status } = bestellung;

      const queryMaterialien = `
        SELECT m.MatID, m.Name, mb.Menge
        FROM materialbestellung mb
        JOIN material m ON mb.MatID = m.MatID
        WHERE mb.BestellID = ?
      `;
      const [materialRows]: any = await connection.execute(queryMaterialien, [BestellID]);

      const bestellObjekt: Bestellung = {
        BestellID,
        LiefID,
        LagerID,
        Bestelldatum,
        Materialien: []
      };

      for (const material of materialRows) {
        const { MatID, Name, Menge } = material;
        bestellObjekt.Materialien.push({ MatID, Name, Menge });
      }

      if (Status === 'offen') {
        Bestellungen.Wareneingang.offen.push(bestellObjekt);
      } else if (Status === 'pruefung') {
        Bestellungen.Wareneingang.pruefung.push(bestellObjekt);
      }
    }

    const validatedData = validateData("wareneingangSchema", Bestellungen);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Bestellungen erfolgreich abgerufen.",
        data: validatedData,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerWareneingang");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
