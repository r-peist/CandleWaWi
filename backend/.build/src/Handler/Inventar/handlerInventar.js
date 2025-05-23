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
exports.handlerInventar = void 0;
const dbclient_1 = require("../../db/dbclient"); // Importiere den DB-Wrapper
const node_fetch_1 = __importDefault(require("node-fetch")); // Für HTTP Aufruf
const validate_1 = require("../../validation/validate");
const Errors = __importStar(require("../../error/errors"));
const handlerInventar = async (event) => {
    let connection;
    try {
        connection = await (0, dbclient_1.getConnection)();
        const [rows] = await connection.query(`
      SELECT
        m.MatKatID,
        mk.Name AS Kategorie,
        m.MatID,
        m.Name AS Materialname,
        m.SKU,
        m.Active,
        ml.LagerID,
        l.Name AS Lagername,
        ml.Menge,
        b.BehaelterID,
        b.Name AS Behaeltername,
        de.DeckelID,
        de.Name AS Deckelname,
        do.DochtID,
        do.Name AS Dochtname,
        w.WarnEttID,
        w.Name as Warnettikettname
      FROM material m
      JOIN materialkategorie mk ON m.MatKatID = mk.MatKatID
      JOIN materiallager ml ON m.MatID = ml.MatID
      JOIN lager l ON l.LagerID = ml.LagerID
      LEFT JOIN behaelter b ON m.MatID = b.MatID
      LEFT JOIN deckel de ON m.MatID = de.MatID
      LEFT JOIN docht do ON m.MatID = do.MatID
      LEFT JOIN warnettikett w ON m.MatID = w.MatID
      ORDER BY m.MatKatID  
    `);
        console.log("DB Ergebnis: ", JSON.stringify(rows, null, 2));
        // 🔥 JSON strukturieren (Gruppieren nach MatKatID)
        const Inventar = rows.reduce((acc, row) => {
            let kategorie = acc.find((k) => k.MatKatID === row.MatKatID);
            if (!kategorie) {
                kategorie = {
                    MatKatID: row.MatKatID,
                    Kategorie: row.Kategorie,
                    Materialien: []
                };
                acc.push(kategorie);
            }
            // Basis-Objekt für Materialien
            const materialObj = {
                MatID: row.MatID,
                Materialname: row.Materialname,
                SKU: row.SKU,
                Active: row.Active,
                LagerID: row.LagerID,
                Lagername: row.Lagername,
                Menge: row.Menge
            };
            //
            if ([3].includes(row.MatKatID)) {
                Object.assign(materialObj, {
                    DochtID: row.DochtID,
                    Dochtname: row.Dochtname
                });
            }
            else if ([4].includes(row.MatKatID)) {
                Object.assign(materialObj, {
                    BehaelterID: row.BehaelterID,
                    Behaeltername: row.Behaeltername
                });
            }
            else if ([11].includes(row.MatKatID)) {
                Object.assign(materialObj, {
                    DeckelID: row.DeckelID,
                    Deckelname: row.Deckelname
                });
            }
            else if ([12].includes(row.MatKatID)) {
                Object.assign(materialObj, {
                    WarnEttID: row.WarnEttID,
                    Warnettikettname: row.Warnettikettname
                });
            }
            // Füge das Materialobjekt in das Materialien-Array der entsprechenden Kategorie ein
            kategorie.Materialien.push(materialObj);
            return acc;
        }, []);
        console.log("Komplettes Inventar JSON:", JSON.stringify(Inventar, null, 2));
        const inventarObject = { Inventar };
        const validatedData = (0, validate_1.validateData)("inventarSchema", inventarObject);
        console.log("Komplettes Inventar JSON nach Valid:", JSON.stringify(validatedData, null, 2));
        // HTTP-Post-Aufruf mit node-fetch
        const response = await (0, node_fetch_1.default)("http://localhost:3001/responseSender", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedData),
        });
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        const responseBody = await response.json();
        // Erfolgreiche Antwort mit Abfrageergebnissen
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Datenbank-Abfrage des Inventars an sendInventory geschickt.",
                data: validatedData,
                response: responseBody,
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error);
    }
    finally {
        // Verbindung freigeben
        if (connection) {
            connection.release();
        }
        await (0, dbclient_1.closePool)();
    }
};
exports.handlerInventar = handlerInventar;
//# sourceMappingURL=handlerInventar.js.map