import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import * as Errors from "../../../error/errors";
import { validateData } from "../../../validation/validate";
import { RezeptKerze, RezeptSprayDiff, RezeptZP, ValidatedEvent, Zutaten } from "../../../interfaces";
import mysql from "mysql2/promise";
import { error } from "console";

export const handlerHerstellung = async (
  event: ValidatedEvent<{Rezept: { Name: string, RezeptID: number, BehaelterID: number, DeckelID: number, 
    MatID: number, Menge: number, Materialien: [] }}>
): Promise<APIGatewayProxyResult> => {
  let connection;
  const {Rezept: { Name, RezeptID, BehaelterID, DeckelID, MatID, Menge, Materialien = [{MatID, Menge}] }} = event.validatedBody;
  let mats: any [] = [];
  

  try {
    connection = await getConnection();
    await connection.beginTransaction();

    //MatIDs Deckel Behälter zwischenspeichern
    if (Name === "Kerze") {
      console.log("Innerhalb if-Klause Kerze");
      const [behaelterrows]: any = await connection.query(`
        SELECT
          MatID AS BehaelterMatID
        FROM behaelter
        WHERE BehaelterID = ?
      `, [BehaelterID]);

      const [deckelrows]: any = await connection.query(`
        SELECT
          MatID AS DeckelMatID
        FROM deckel
        WHERE DeckelID = ?
      `, [DeckelID]);

      console.log("MatIDs ausgelesen");
      //Einzelne Objekte mit MatID + Menge in ein Array zum aktualisieren der DB Bestände
      //const { BehaelterMatID, DeckelMatID } = matrows;
      mats.push({MatID: MatID, Menge: Menge}, 
                {MatID: parseInt(behaelterrows[0].BehaelterMatID), Menge: Menge}, 
                {MatID: parseInt(deckelrows[0].DeckelMatID), Menge: Menge}
              );

      console.log("Andere MatIDs: ", behaelterrows[0], " und ", deckelrows[0])

      for (const matrows of Materialien) {
        mats.push(matrows);
        console.log("Mats Array: ", mats);
      }

      for (const rows of mats) {
        console.log("innerhalb for schleife mit: ", rows.Menge, " und ", rows.MatID);
        //COALESCE macht NULL-Prüfung | (?, 0) weil, wenn null ist bei (?) der neue Wert auch null
        const [updatekerze]: any = await connection.query(`
          UPDATE materiallager
          SET Menge = Menge - COALESCE (?, 0)
          WHERE MatID = ?
        `, [rows.Menge, rows.MatID]);

        const [resultkerze]: any = await connection.query(`
          SELECT Menge
          FROM materiallager
          WHERE MatID = ?
        `, [rows.MatID]);

        console.log("Aktualisierte Menge für ", rows.MatID, ": ", resultkerze.Menge);
      }
      
    } else if (Name === "SprayDiff") {
      const [rows]: any = await connection.query(`
      
      `);
    } else if (Name === "ZP") {
      const [rows]: any = await connection.query(`
      
      `);
    }



    const validatedData = ""; 
    //validateData("updatedSchema", updated);
    
        // HTTP-Post-Aufruf mit node-fetch
        const response = await fetch("https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/responseSender", {
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
        // Rollback der Transaktion bei Fehler
        if (connection) {
            await connection.rollback();
            //Innerer try() um weiter oben rollback abzufangen und dann das responseObjekt mit Fehlermeldung auszustatten.
          }
        return Errors.handleError(error, "handlerUpsertRezept");
      } finally {
        // Verbindung freigeben
        if (connection) {
          connection.release();
        }
        await closePool();
      }
};