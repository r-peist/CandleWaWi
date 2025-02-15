import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../../db/dbclient"; // Importiere den DB-Wrapper
import fetch from "node-fetch"; // Für HTTP Aufruf
import * as Errors from "../../../error/errors";
import { validateData } from "../../../validation/validate";
import { RezeptKerze, RezeptSprayDiff, RezeptZP, ValidatedEvent, Zutaten } from "../../../interfaces";
import mysql from "mysql2/promise";
import { error } from "console";

// Dann definierst du den Typ für den validierten Body:
type RezeptValidData = {
    Rezept: {
        Kerze?: RezeptKerze;
        SprayDiff?: RezeptSprayDiff;
        ZP?: RezeptZP;
    }
  };

export const handlerUpsertRezept = async (
  event: ValidatedEvent<RezeptValidData>
): Promise<APIGatewayProxyResult> => {
  let connection, rezeptID;
  let updated = { Updated: {}}

  try {
    const rezept = event.validatedBody;    
    // Verbindung zur Datenbank herstellen
  try{
    connection = await getConnection();
    await connection.beginTransaction();

    if (rezept.Rezept.Kerze?.RezeptKerzeID) {
        //UPDATE Kerze        
        const [result]: any = await connection.query(`
            UPDATE rezeptkerze 
            SET Name = ?, MatID = ?, BehaelterID = ?, DeckelID = ?, DochtID = ?, ZPRezeptID = ?, WarnEttID = ?
            WHERE RezeptKerzeID = ? 
        `, [rezept.Rezept.Kerze.Name, 
            rezept.Rezept.Kerze.MatID, 
            rezept.Rezept.Kerze.BehaelterID, 
            rezept.Rezept.Kerze.DeckelID,
            rezept.Rezept.Kerze.DochtID, 
            rezept.Rezept.Kerze.ZPRezeptID, 
            rezept.Rezept.Kerze.WarnEttID, 
            rezept.Rezept.Kerze.RezeptKerzeID]);
        updated.Updated = { Rezept: "Kerze", ID: rezept.Rezept.Kerze.RezeptKerzeID, message: "Kerzenrezept updated." };
        console.log(updated);
    } else if (!rezept.Rezept.Kerze?.RezeptKerzeID && rezept.Rezept.Kerze?.Name) {
        //INSERT Kerze
        console.log("Drin in insert kerze");
        const [result]: any = await connection.query(`
            INSERT INTO rezeptkerze (Name, MatID, BehaelterID, DeckelID, DochtID, ZPRezeptID, WarnEttID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [rezept.Rezept.Kerze.Name,
              rezept.Rezept.Kerze.MatID,
              rezept.Rezept.Kerze.BehaelterID,
              rezept.Rezept.Kerze.DeckelID,
              rezept.Rezept.Kerze.DochtID,
              rezept.Rezept.Kerze.ZPRezeptID,
              rezept.Rezept.Kerze.WarnEttID]);
        rezeptID = result.insertId;
        updated.Updated = { Rezept: "Kerze", ID: rezeptID, message: "Kerzenrezept hinzugefügt." };
    } else if (rezept.Rezept.SprayDiff?.RezeptSprayDifID) {
        console.log("Drin in update spray");
        //UPDATE SprayDiff
        const [result]: any = await connection.query(`
            UPDATE rezeptspraydif 
            SET Name = ?, BehaelterID = ?, DeckelID = ?, WarnEttID = ?, ZPRezeptID1 = ?, ZPRezeptID2 = ?
            WHERE RezeptSprayDifID = ? 
        `, [rezept.Rezept.SprayDiff.Name, 
            rezept.Rezept.SprayDiff.BehaelterID, 
            rezept.Rezept.SprayDiff.DeckelID,
            rezept.Rezept.SprayDiff.WarnEttID,  
            rezept.Rezept.SprayDiff.ZPRezeptID1, 
            rezept.Rezept.SprayDiff.ZPRezeptID2, 
            rezept.Rezept.SprayDiff.RezeptSprayDifID]);
        updated.Updated = { Rezept: "SprayDiff", ID: rezept.Rezept.SprayDiff.RezeptSprayDifID, message: "SprayDiff updated." }
    } else if (!rezept.Rezept.SprayDiff?.RezeptSprayDifID && rezept.Rezept.SprayDiff?.Name) {
        console.log("Drin in insert spray");
        //INSERT SprayDiff
        const [result]: any = await connection.query(`
            INSERT INTO rezeptspraydif (Name, BehaelterID, DeckelID, WarnEttID, ZPRezeptID1, ZPRezeptID2)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [rezept.Rezept.SprayDiff.Name,
              rezept.Rezept.SprayDiff.BehaelterID,
              rezept.Rezept.SprayDiff.DeckelID,
              rezept.Rezept.SprayDiff.WarnEttID,
              rezept.Rezept.SprayDiff.ZPRezeptID1,
              rezept.Rezept.SprayDiff.ZPRezeptID2]);
        rezeptID = result.insertId;
        updated.Updated = { Rezept: "SprayDiff", ID: rezeptID, message: "SprayDiffRezept hinzugefügt." };
    } else if (rezept.Rezept.ZP?.ZPRezeptID) {
        console.log("Drin in update zp");
        //UPDATE ZP
        const [result]: any = await connection.query(`
            UPDATE zwischenproduktrezept 
            SET Name = ?, Beschreibung = ?, Änderungsdatum = ?
            WHERE ZPRezeptID = ? 
        `, [rezept.Rezept.ZP.Name, 
            rezept.Rezept.ZP.Beschreibung, 
            rezept.Rezept.ZP.Changedate, 
            rezept.Rezept.ZP.ZPRezeptID]);
        const [deletezp]: any = await connection.query(
          `DELETE FROM rezeptzutaten WHERE ZPRezeptID = ?`,
          [rezept.Rezept.ZP.ZPRezeptID]
        );
        for (const zutaten of rezept.Rezept.ZP.Zutaten) {
            const { MatID, Menge } = zutaten;
            const [zutatenresult]: any = await connection.query(`
                INSERT INTO rezeptzutaten (ZPRezeptID, MatID, Menge) 
                VALUES (?, ?, ?)
            `, [rezept.Rezept.ZP.ZPRezeptID, MatID, Menge]);
        }
        updated.Updated = { Rezept: "ZP", ID: rezept.Rezept.ZP.ZPRezeptID, message: "ZP updated." }
    } else if (!rezept.Rezept.ZP?.ZPRezeptID && rezept.Rezept.ZP?.Name) {
        console.log("Drin in insert zp");
        //INSERT ZP
        const [result]: any = await connection.query(`
            INSERT INTO zwischenproduktrezept (Name, Beschreibung, Erstellungsdatum)
            VALUES (?, ?, ?)
        `, [rezept.Rezept.ZP.Name, 
            rezept.Rezept.ZP.Beschreibung, 
            rezept.Rezept.ZP.Releasedate]);
        rezeptID = result.insertId;
        const zutaten: Zutaten[] = rezept.Rezept.ZP.Zutaten; 
        for (const matZutaten of zutaten) {
            const { MatID, Menge } = matZutaten;
            const [matresult]: any = await connection.query(`
                INSERT INTO rezeptzutaten (ZPRezeptID, MatID, Menge)
                VALUES (?, ?, ?)
            `, [rezeptID, MatID, Menge]);
        }
        updated.Updated = { Rezept: "ZP", ID: rezeptID, message: "ZPRezept hinzugefügt." };
    }
    // Transaktion committen, wenn alles erfolgreich ist
    await connection.commit();
  } catch (error) {
    Errors.handleError(error, "Element bereits in der DB vorhanden")
    if (connection) {
      await connection.rollback();
      updated.Updated = { Rezept: "Fehler", ID: 0, message: "Element bereits vorhanden." }
    }
  }

    const validatedData = validateData("updatedSchema", updated);

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
