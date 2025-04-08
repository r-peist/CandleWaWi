import { APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../../db/dbclient";
import * as Errors from "../../../error/errors";
import { validateData } from "../../../validation/validate";
import {
    RezeptKerze,
    RezeptSprayDiff,
    RezeptZP,
    ValidatedEvent,
    Zutaten,
} from "../../../interfaces";

// Typ für validierte Daten
type RezeptValidData = {
    Rezept: {
        Kerze?: RezeptKerze;
        SprayDiff?: RezeptSprayDiff;
        ZP?: RezeptZP;
    };
};

export const handlerUpsertRezept = async (
    event: ValidatedEvent<RezeptValidData>
): Promise<APIGatewayProxyResult> => {
    let connection;
    let rezeptID: number | undefined;
    let updated = { Updated: {} };

    try {
        const rezept = event.validatedBody;
        connection = await getConnection();
        await connection.beginTransaction();

        if (rezept.Rezept.Kerze?.RezeptKerzeID) {
            await connection.query(
                `UPDATE rezeptkerze 
         SET Name = ?, MatID = ?, BehaelterID = ?, DeckelID = ?, DochtID = ?, ZPRezeptID = ?, WarnEttID = ?
         WHERE RezeptKerzeID = ?`,
                [
                    rezept.Rezept.Kerze.Name,
                    rezept.Rezept.Kerze.MatID,
                    rezept.Rezept.Kerze.BehaelterID,
                    rezept.Rezept.Kerze.DeckelID,
                    rezept.Rezept.Kerze.DochtID,
                    rezept.Rezept.Kerze.ZPRezeptID,
                    rezept.Rezept.Kerze.WarnEttID,
                    rezept.Rezept.Kerze.RezeptKerzeID,
                ]
            );
            updated.Updated = {
                Rezept: "Kerze",
                ID: rezept.Rezept.Kerze.RezeptKerzeID,
                message: "Kerzenrezept aktualisiert.",
            };
        } else if (!rezept.Rezept.Kerze?.RezeptKerzeID && rezept.Rezept.Kerze?.Name) {
            const [result]: any = await connection.query(
                `INSERT INTO rezeptkerze (Name, MatID, BehaelterID, DeckelID, DochtID, ZPRezeptID, WarnEttID)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    rezept.Rezept.Kerze.Name,
                    rezept.Rezept.Kerze.MatID,
                    rezept.Rezept.Kerze.BehaelterID,
                    rezept.Rezept.Kerze.DeckelID,
                    rezept.Rezept.Kerze.DochtID,
                    rezept.Rezept.Kerze.ZPRezeptID,
                    rezept.Rezept.Kerze.WarnEttID,
                ]
            );
            rezeptID = result.insertId;
            updated.Updated = {
                Rezept: "Kerze",
                ID: rezeptID,
                message: "Kerzenrezept hinzugefügt.",
            };
        } else if (rezept.Rezept.SprayDiff?.RezeptSprayDifID) {
            await connection.query(
                `UPDATE rezeptspraydif 
         SET Name = ?, BehaelterID = ?, DeckelID = ?, WarnEttID = ?, ZPRezeptID1 = ?, ZPRezeptID2 = ?
         WHERE RezeptSprayDifID = ?`,
                [
                    rezept.Rezept.SprayDiff.Name,
                    rezept.Rezept.SprayDiff.BehaelterID,
                    rezept.Rezept.SprayDiff.DeckelID,
                    rezept.Rezept.SprayDiff.WarnEttID,
                    rezept.Rezept.SprayDiff.ZPRezeptID1,
                    rezept.Rezept.SprayDiff.ZPRezeptID2,
                    rezept.Rezept.SprayDiff.RezeptSprayDifID,
                ]
            );
            updated.Updated = {
                Rezept: "SprayDiff",
                ID: rezept.Rezept.SprayDiff.RezeptSprayDifID,
                message: "SprayDiff aktualisiert.",
            };
        } else if (!rezept.Rezept.SprayDiff?.RezeptSprayDifID && rezept.Rezept.SprayDiff?.Name) {
            const [result]: any = await connection.query(
                `INSERT INTO rezeptspraydif (Name, BehaelterID, DeckelID, WarnEttID, ZPRezeptID1, ZPRezeptID2)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    rezept.Rezept.SprayDiff.Name,
                    rezept.Rezept.SprayDiff.BehaelterID,
                    rezept.Rezept.SprayDiff.DeckelID,
                    rezept.Rezept.SprayDiff.WarnEttID,
                    rezept.Rezept.SprayDiff.ZPRezeptID1,
                    rezept.Rezept.SprayDiff.ZPRezeptID2,
                ]
            );
            rezeptID = result.insertId;
            updated.Updated = {
                Rezept: "SprayDiff",
                ID: rezeptID,
                message: "SprayDiff-Rezept hinzugefügt.",
            };
        } else if (rezept.Rezept.ZP?.ZPRezeptID) {
            await connection.query(
                `UPDATE zwischenproduktrezept 
         SET Name = ?, Beschreibung = ?, Änderungsdatum = ?
         WHERE ZPRezeptID = ?`,
                [
                    rezept.Rezept.ZP.Name,
                    rezept.Rezept.ZP.Beschreibung,
                    rezept.Rezept.ZP.Changedate,
                    rezept.Rezept.ZP.ZPRezeptID,
                ]
            );

            await connection.query(
                `DELETE FROM rezeptzutaten WHERE ZPRezeptID = ?`,
                [rezept.Rezept.ZP.ZPRezeptID]
            );

            for (const zutat of rezept.Rezept.ZP.Zutaten) {
                await connection.query(
                    `INSERT INTO rezeptzutaten (ZPRezeptID, MatID, Menge) VALUES (?, ?, ?)`,
                    [rezept.Rezept.ZP.ZPRezeptID, zutat.MatID, zutat.Menge]
                );
            }

            updated.Updated = {
                Rezept: "ZP",
                ID: rezept.Rezept.ZP.ZPRezeptID,
                message: "ZP aktualisiert.",
            };
        } else if (!rezept.Rezept.ZP?.ZPRezeptID && rezept.Rezept.ZP?.Name) {
            const [result]: any = await connection.query(
                `INSERT INTO zwischenproduktrezept (Name, Beschreibung, Erstellungsdatum)
         VALUES (?, ?, ?)`,
                [
                    rezept.Rezept.ZP.Name,
                    rezept.Rezept.ZP.Beschreibung,
                    rezept.Rezept.ZP.Releasedate,
                ]
            );

            rezeptID = result.insertId;

            for (const zutat of rezept.Rezept.ZP.Zutaten) {
                await connection.query(
                    `INSERT INTO rezeptzutaten (ZPRezeptID, MatID, Menge)
           VALUES (?, ?, ?)`,
                    [rezeptID, zutat.MatID, zutat.Menge]
                );
            }

            updated.Updated = {
                Rezept: "ZP",
                ID: rezeptID,
                message: "ZP-Rezept hinzugefügt.",
            };
        }

        await connection.commit();

        const validatedData = validateData("updatedSchema", updated);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Rezept erfolgreich verarbeitet",
                data: validatedData,
            }),
        };
    } catch (error) {
        if (connection) await connection.rollback();
        return Errors.handleError(error, "handlerUpsertRezept");
    } finally {
        if (connection) connection.release();
        await closePool();
    }
};
