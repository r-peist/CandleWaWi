import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
import * as Errors from "../../error/errors";
import { ValidatedEvent } from "../../interfaces";
import { validateData } from "../../validation/validate";

export const handlerBestellung = async (
    event: ValidatedEvent<{ Bestellung: { LiefID: number, LagerID: number, Datum: string, Benutzer: string, Materialien: [] } }>
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    const { Bestellung: { LiefID, LagerID, Datum, Benutzer, Materialien } } = event.validatedBody;
    console.log("Validierte Daten aus FE sind: LiefID:", LiefID, ", LagerID:", LagerID, ", Datum:", Datum, ", Benutzer:", Benutzer);

    connection = await getConnection();

    const insertBestellungQuery = `
      INSERT INTO bestellung (LiefID, LagerID, Bestelldatum, Benutzer)
      VALUES (?, ?, ?, ?)
    `;

    const [result]: any = await connection.execute(insertBestellungQuery, [LiefID, LagerID, Datum, Benutzer]);
    const bestellID = result.insertId;

    console.log("Abgerufene BestellID:", bestellID);

    const insertMaterialQuery = `
      INSERT INTO materialbestellung (BestellID, MatID, Menge)
      VALUES (?, ?, ?)
    `;

    for (const material of Materialien) {
      const { MatID, Menge } = material;
      if (!MatID || !Menge) {
        throw new Error("MatID und Menge müssen für jedes Material angegeben werden.");
      }
      await connection.execute(insertMaterialQuery, [bestellID, MatID, Menge]);
    }

    const BestellID = { BestellID: { BestellID: bestellID } };
    const validatedData = validateData("bestellIDSchema", BestellID);

    // 🎯 Direktes Return-Objekt statt responseSender
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Bestellung erfolgreich gespeichert.",
        data: validatedData,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerBestellung");
  } finally {
    if (connection) {
      connection.release();
    }
    await closePool();
  }
};
