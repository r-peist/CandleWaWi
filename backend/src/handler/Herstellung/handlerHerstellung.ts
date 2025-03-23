import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import * as Errors from "../../error/errors";
import { validateData } from "../../validation/validate";
import { RezeptKerze, RezeptSprayDiff, RezeptZP, ValidatedEvent, Zutaten } from "../../interfaces";
import mysql from "mysql2/promise";
import { error } from "console";

export const handlerHerstellung = async (
  event: ValidatedEvent<{Rezept: { Name: string, RezeptID: number, BehaelterID: number, DeckelID: number, 
    MatID: number, Menge: number, Materialien: [] }}>
): Promise<APIGatewayProxyResult> => {
  let connection;
  const {Rezept: { Name, RezeptID, BehaelterID, DeckelID, MatID, Menge, Materialien = [] }} = event.validatedBody;
  let mats: any [] = [];
  

  try {
    connection = await getConnection();
    await connection.beginTransaction();

    if (Name === "Kerze") {
      const [matrows]: any = await connection.query(`
        SELECT
          b.MatID AS BehaelterMatID,
          d.MatID AS DeckelMatID
        FROM material m
        JOIN behaelter b ON m.MatID = b.MatID
        JOIN deckel d ON m.MatID = d.MatID
        WHERE b.MatID = ? OR d.MatID = ?
      `, [BehaelterID, DeckelID]);

      const { BehaelterMatID, DeckelMatID } = matrows[0];
      mats.push({MatID: MatID, Menge: Menge}, 
                {MatID: BehaelterMatID, Menge: Menge}, 
                {MatID: DeckelMatID, Menge: Menge},
                ...Materialien
              );

      for (const rows of mats) {
        const
      }
      const [update]: any = await connection.query(`
        UPDATE materiallager
        SET Menge = Menge - COALESCE (?, bestand)
        WHERE MatID = ?
      `);
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