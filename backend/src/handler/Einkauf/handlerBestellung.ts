import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch";
import * as Errors from "../../error/errors";
import { ValidatedEvent } from "../../interfaces";
import { validateData } from "../../validation/validate";
import { dateType } from "aws-sdk/clients/iam";

export const handlerBestellung = async (
  event: ValidatedEvent<{ Bestellung: { LiefID: number, LagerID: number, Datum: string, Materialien: [] }}>
  ): Promise<APIGatewayProxyResult> => {

  let connection;
  try {
    // Überprüfen, ob der Body korrekt ist
    const { Bestellung: { LiefID, LagerID, Datum, Materialien }} = event.validatedBody;
    console.log("Validierte Daten aus FE sind: LiefID: ", LiefID, ", LagerID: ", LagerID, ", Datum: ", Datum);

    // Verbindung zur Datenbank herstellen
    connection = await getConnection();
    
    // SQL-Abfrage mit Joins, um MaterialName und LieferantName abzurufen
    const query = `
        INSERT INTO bestellung (LiefID, LagerID, Bestelldatum)
        VALUES (?, ?, ?)
    `;

    const [result]: any = await connection.execute(query, [LiefID, LagerID, Datum]); 

    // Die automatisch generierte ID (BestellID) abrufen
    const bestellID = result.insertId;
    console.log("Abgerufene BestellID: ", bestellID);

    // Materialien in der Tabelle `MaterialBestellung` speichern
    const materialQuery = `
        INSERT INTO materialbestellung (BestellID, MatID, Menge)
        VALUES (?, ?, ?)
    `;

    for (const material of Materialien) {
      const { MatID, Menge } = material;
      if (!MatID || !Menge) {
        throw new Error("MatID und Menge müssen für jedem Material angegeben werden.");
      }
      await connection.execute(materialQuery, [bestellID, MatID, Menge]);
    }

    const BestellID = {BestellID: { BestellID: bestellID }};
    console.log("Bestellobjekt: ", BestellID);
    const validatedData = validateData("bestellIDSchema", BestellID);

    const response = await fetch("http://localhost:3001/responseSender", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData), 
    });

    const responseBody = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Generierte BestellID erfolgreich an responseSender geschickt",
        data: validatedData,
        response: responseBody,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerBestellung");
  }
};
