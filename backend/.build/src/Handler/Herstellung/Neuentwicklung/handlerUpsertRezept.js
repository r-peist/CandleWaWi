"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerUpsertRezept = void 0;
const dbclient_1 = require("../../../db/dbclient"); // Importiere den DB-Wrapper
const node_fetch_1 = __importDefault(require("node-fetch")); // Für HTTP Aufruf
const Errors = __importStar(require("../../../error/errors"));
const validate_1 = require("../../../validation/validate");
const handlerUpsertRezept = async (event) => {
    let connection, rezeptID;
    let updated = { Updated: {} };
    try {
        const rezept = event.validatedBody;
        // Verbindung zur Datenbank herstellen
        try {
            connection = await (0, dbclient_1.getConnection)();
            await connection.beginTransaction();
            if (rezept.Rezept.Kerze?.RezeptKerzeID) {
                //UPDATE Kerze        
                const [result] = await connection.query(`
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
            }
            else if (!rezept.Rezept.Kerze?.RezeptKerzeID && rezept.Rezept.Kerze?.Name) {
                //INSERT Kerze
                console.log("Drin in insert kerze");
                const [result] = await connection.query(`
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
            }
            else if (rezept.Rezept.SprayDiff?.RezeptSprayDifID) {
                console.log("Drin in update spray");
                //UPDATE SprayDiff
                const [result] = await connection.query(`
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
                updated.Updated = { Rezept: "SprayDiff", ID: rezept.Rezept.SprayDiff.RezeptSprayDifID, message: "SprayDiff updated." };
            }
            else if (!rezept.Rezept.SprayDiff?.RezeptSprayDifID && rezept.Rezept.SprayDiff?.Name) {
                console.log("Drin in insert spray");
                //INSERT SprayDiff
                const [result] = await connection.query(`
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
            }
            else if (rezept.Rezept.ZP?.ZPRezeptID) {
                console.log("Drin in update zp");
                //UPDATE ZP
                const [result] = await connection.query(`
            UPDATE zwischenproduktrezept 
            SET Name = ?, Beschreibung = ?, Änderungsdatum = ?
            WHERE ZPRezeptID = ? 
        `, [rezept.Rezept.ZP.Name,
                    rezept.Rezept.ZP.Beschreibung,
                    rezept.Rezept.ZP.Changedate,
                    rezept.Rezept.ZP.ZPRezeptID]);
                const [deletezp] = await connection.query(`DELETE FROM rezeptzutaten WHERE ZPRezeptID = ?`, [rezept.Rezept.ZP.ZPRezeptID]);
                for (const zutaten of rezept.Rezept.ZP.Zutaten) {
                    const { MatID, Menge } = zutaten;
                    const [zutatenresult] = await connection.query(`
                INSERT INTO rezeptzutaten (ZPRezeptID, MatID, Menge) 
                VALUES (?, ?, ?)
            `, [rezept.Rezept.ZP.ZPRezeptID, MatID, Menge]);
                }
                updated.Updated = { Rezept: "ZP", ID: rezept.Rezept.ZP.ZPRezeptID, message: "ZP updated." };
            }
            else if (!rezept.Rezept.ZP?.ZPRezeptID && rezept.Rezept.ZP?.Name) {
                console.log("Drin in insert zp");
                //INSERT ZP
                const [result] = await connection.query(`
            INSERT INTO zwischenproduktrezept (Name, Beschreibung, Erstellungsdatum)
            VALUES (?, ?, ?)
        `, [rezept.Rezept.ZP.Name,
                    rezept.Rezept.ZP.Beschreibung,
                    rezept.Rezept.ZP.Releasedate]);
                rezeptID = result.insertId;
                const zutaten = rezept.Rezept.ZP.Zutaten;
                for (const matZutaten of zutaten) {
                    const { MatID, Menge } = matZutaten;
                    const [matresult] = await connection.query(`
                INSERT INTO rezeptzutaten (ZPRezeptID, MatID, Menge)
                VALUES (?, ?, ?)
            `, [rezeptID, MatID, Menge]);
                }
                updated.Updated = { Rezept: "ZP", ID: rezeptID, message: "ZPRezept hinzugefügt." };
            }
            // Transaktion committen, wenn alles erfolgreich ist
            await connection.commit();
        }
        catch (error) {
            Errors.handleError(error, "Element bereits in der DB vorhanden");
            if (connection) {
                await connection.rollback();
                updated.Updated = { Rezept: "Fehler", ID: 0, message: "Element bereits vorhanden." };
            }
        }
        const validatedData = (0, validate_1.validateData)("updatedSchema", updated);
        // HTTP-Post-Aufruf mit node-fetch
        const response = await (0, node_fetch_1.default)("http://localhost:3001/responseSender", {
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
    }
    catch (error) {
        // Rollback der Transaktion bei Fehler
        if (connection) {
            await connection.rollback();
            //Innerer try() um weiter oben rollback abzufangen und dann das responseObjekt mit Fehlermeldung auszustatten.
        }
        return Errors.handleError(error, "handlerUpsertRezept");
    }
    finally {
        // Verbindung freigeben
        if (connection) {
            connection.release();
        }
        await (0, dbclient_1.closePool)();
    }
};
exports.handlerUpsertRezept = handlerUpsertRezept;
//# sourceMappingURL=handlerUpsertRezept.js.map