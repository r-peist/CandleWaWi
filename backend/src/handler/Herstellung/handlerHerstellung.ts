import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import * as Errors from "../../error/errors";
import { validateData } from "../../validation/validate";
import { RezeptKerze, RezeptSprayDiff, RezeptZP, ValidatedEvent, Zutaten } from "../../interfaces";
import mysql from "mysql2/promise";
import { error } from "console";

export const handlerHerstellung = async (
  event: ValidatedEvent
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    connection = await getConnection();
    await connection.beginTransaction();


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